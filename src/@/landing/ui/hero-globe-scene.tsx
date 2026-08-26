import { useEffect, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';

import {
  loadHeroGlobeBuffers,
  loadHeroGlobeNames,
  markHeroGlobe,
  NamedSchool,
} from './hero-globe.resources';

type Status = 'bad' | 'good' | 'moderate' | 'unknown';
type PointKind = 'land' | Status;

interface GlobePoint {
  kind: PointKind;
  latitude: number;
  longitude: number;
  seed: number;
}

interface HeroGlobeSceneProps {
  labels: Record<Status, string> & { school: string };
  onReady: () => void;
  onUnavailable: () => void;
}

const STATUS: Status[] = ['good', 'moderate', 'bad', 'unknown'];
const STATUS_COLOR: Record<Status, string> = {
  bad: '#ed5b4c',
  good: '#00d661',
  moderate: '#f6c344',
  unknown: '#1d8cf0',
};
const GLOBE_COLOR = {
  land: '#25394f',
  ocean: '#121d2a',
  rim: '#172538',
};
const FOCUS_LONGITUDE = 25;
const FOCUS_LATITUDE = -9;
// Westward excursion from FOCUS_LONGITUDE, not a symmetric amplitude: the sway
// runs 25° -> -35° and back, which is the widest arc that keeps both ends on
// populated land. Drifting further west puts the empty Pacific on screen.
const SWAY = (60 * Math.PI) / 180;
const SWAY_PERIOD = 80;
const PULSE_PERIOD = 2.4;
const PULSE_GROW = 3.6;
const CAMERA_DISTANCE = 4.2;
const INITIAL_FOV = 32;
const HALF_VIEWPORT_HEIGHT =
  CAMERA_DISTANCE * Math.tan((INITIAL_FOV / 2) * (Math.PI / 180));
const GLOBE_SCALE = 2.05;
const GLOBE_POSITION: [number, number] = [0.75, -0.5];
const MAX_CARDS = 3;
const FRAME_INTERVAL = 1000 / 30;

const toVector = (
  longitude: number,
  latitude: number,
): [number, number, number] => {
  const phi = ((90 - latitude) * Math.PI) / 180;
  const theta = ((longitude + 180) * Math.PI) / 180;

  return [
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ];
};

const createRandom = () => {
  let state = 1337;
  return () => (state = (state * 16_807) % 2_147_483_647) / 2_147_483_647;
};

const getGlobeColors = () => ({
  ...GLOBE_COLOR,
  status: STATUS_COLOR,
});

const createCard = (
  labels: HeroGlobeSceneProps['labels'],
  point: GlobePoint,
  color: string,
  name?: string,
) => {
  const card = document.createElement('div');
  const marker = document.createElement('i');
  const title = document.createElement('b');
  const status = document.createElement('span');

  card.className = 'hero-globe-card';
  card.setAttribute('aria-hidden', 'true');
  marker.style.setProperty('--hero-status-color', color);
  title.textContent = name || labels.school;
  status.textContent = labels[point.kind as Status];
  card.append(marker, title, status);

  return card;
};

export default function HeroGlobeScene({
  labels,
  onReady,
  onUnavailable,
}: HeroGlobeSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const canvas = document.createElement('canvas');
    const cardsLayer = document.createElement('div');
    canvas.setAttribute('aria-hidden', 'true');
    cardsLayer.className = 'hero-globe-cards';
    root.append(canvas, cardsLayer);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: 'high-performance',
      });
    } catch {
      canvas.remove();
      cardsLayer.remove();
      onUnavailable();
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;

    const scene = new Scene();
    const camera = new PerspectiveCamera(INITIAL_FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAMERA_DISTANCE);

    const globe = new Group();
    globe.scale.setScalar(GLOBE_SCALE);
    scene.add(globe);

    const initialColors = getGlobeColors();
    const sphereGeometry = new SphereGeometry(0.985, 64, 64);
    const sphereMaterial = new ShaderMaterial({
      fragmentShader: `
        uniform vec3 ocean;
        uniform vec3 rim;
        varying vec3 normalView;
        varying vec3 viewVector;
        void main() {
          float edge = pow(1.0 - max(dot(normalize(normalView), normalize(viewVector)), 0.0), 3.2);
          gl_FragColor = vec4(mix(ocean, rim, edge), 1.0);
          #include <colorspace_fragment>
        }
      `,
      uniforms: {
        ocean: { value: new Color(initialColors.ocean) },
        rim: { value: new Color(initialColors.rim) },
      },
      vertexShader: `
        varying vec3 normalView;
        varying vec3 viewVector;
        void main() {
          normalView = normalize(normalMatrix * normal);
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          viewVector = -modelViewPosition.xyz;
          gl_Position = projectionMatrix * modelViewPosition;
        }
      `,
    });
    globe.add(new Mesh(sphereGeometry, sphereMaterial));

    const pointMaterial = new ShaderMaterial({
      depthWrite: false,
      fragmentShader: `
        varying vec3 pointColor;
        varying float phase;
        varying float coreRadius;
        varying float antialiasWidth;
        void main() {
          float radius = length(gl_PointCoord - 0.5);
          float alpha = 1.0 - smoothstep(coreRadius - antialiasWidth, coreRadius + antialiasWidth, radius);
          if (phase >= 0.0) {
            float expansion = 1.0 - pow(1.0 - phase, 2.0);
            float pulseRadius = mix(coreRadius, 0.5, expansion);
            float pulseRing = 1.0 - smoothstep(
              antialiasWidth * 1.5,
              antialiasWidth * 3.0,
              abs(radius - pulseRadius)
            );
            alpha = max(alpha, pulseRing * 0.2 * (1.0 - phase));
          }
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(pointColor, alpha);
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      uniforms: {
        pixelRatio: { value: renderer.getPixelRatio() },
        pulseGrow: { value: PULSE_GROW },
        pulsePeriod: { value: PULSE_PERIOD },
        time: { value: 0 },
      },
      vertexShader: `
        attribute float pulse;
        attribute float seed;
        uniform float pixelRatio;
        uniform float pulseGrow;
        uniform float pulsePeriod;
        uniform float time;
        varying vec3 pointColor;
        varying float phase;
        varying float coreRadius;
        varying float antialiasWidth;
        void main() {
          pointColor = color;
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          float pointSize = (0.5 + seed * 0.25) * (3.2 / -modelViewPosition.z);
          phase = pulse > 0.5 ? fract(time / pulsePeriod) : -1.0;
          float spriteSize = pointSize * (pulse > 0.5 ? pulseGrow * 2.0 : 2.2);
          coreRadius = pointSize / spriteSize;
          gl_PointSize = ceil(spriteSize * pixelRatio);
          antialiasWidth = 0.45 / gl_PointSize;
          gl_Position = projectionMatrix * modelViewPosition;
        }
      `,
      vertexColors: true,
    });

    const random = createRandom();
    let points: GlobePoint[] = [];
    let pointsObject: Points | undefined;
    let namedSchools: NamedSchool[] = [];
    let disposed = false;
    let dataReady = false;
    let readyReported = false;
    let reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let isIntersecting = true;
    let isDocumentVisible = document.visibilityState !== 'hidden';
    let isLoopRunning = false;
    let lastFrameAt = -Infinity;
    let animationStartedAt: number | undefined;

    const rebuildPoints = () => {
      if (!points.length) return;

      const colors = getGlobeColors();
      const positions = new Float32Array(points.length * 3);
      const colorValues = new Float32Array(points.length * 3);
      const seeds = new Float32Array(points.length);
      const pulses = new Float32Array(points.length);
      const color = new Color();

      points.forEach((point, index) => {
        positions.set(toVector(point.longitude, point.latitude), index * 3);
        color.set(
          point.kind === 'land' ? colors.land : colors.status[point.kind],
        );
        colorValues.set([color.r, color.g, color.b], index * 3);
        seeds[index] = point.seed;
        pulses[index] = point.kind === 'land' ? 0 : 1;
      });

      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(positions, 3));
      geometry.setAttribute('color', new BufferAttribute(colorValues, 3));
      geometry.setAttribute('seed', new BufferAttribute(seeds, 1));
      geometry.setAttribute('pulse', new BufferAttribute(pulses, 1));

      if (pointsObject) {
        globe.remove(pointsObject);
        pointsObject.geometry.dispose();
      }
      pointsObject = new Points(geometry, pointMaterial);
      globe.add(pointsObject);
    };

    const parseBuffers = (landBuffer: ArrayBuffer, schools?: ArrayBuffer) => {
      const nextPoints: GlobePoint[] = [];
      const land = new Int16Array(landBuffer);

      for (let index = 0; index < land.length; index += 2) {
        if (random() > 0.45) continue;
        nextPoints.push({
          kind: 'land',
          latitude: land[index + 1] / 10,
          longitude: land[index] / 10,
          seed: random(),
        });
      }

      if (schools) {
        const view = new DataView(schools);
        const count = view.getUint32(0, true);
        if (schools.byteLength === 4 + count * 5) {
          for (let index = 0; index < count; index += 1) {
            const offset = 4 + index * 5;
            nextPoints.push({
              kind: STATUS[view.getUint8(offset + 4)] ?? 'unknown',
              latitude: view.getInt16(offset + 2, true) / 100,
              longitude: view.getInt16(offset, true) / 100,
              seed: random(),
            });
          }
        }
      }

      if (!schools) {
        nextPoints.forEach((point) => {
          if (random() < 0.4) point.kind = STATUS[Math.floor(random() * 4)];
        });
      }

      return nextPoints;
    };

    interface LiveCard {
      element: HTMLDivElement;
      expiresAt: number;
      point: GlobePoint;
    }

    const liveCards: LiveCard[] = [];
    const projected = new Vector3();
    const normal = new Vector3();
    let lastCardAt = -Infinity;

    const isFacingCamera = (point: GlobePoint) => {
      normal
        .fromArray(toVector(point.longitude, point.latitude))
        .applyQuaternion(globe.quaternion);
      if (normal.z < 0.45) return false;

      projected
        .fromArray(toVector(point.longitude, point.latitude))
        .applyMatrix4(globe.matrixWorld)
        .project(camera);
      const x = (projected.x * 0.5 + 0.5) * root.clientWidth;
      const y = (-projected.y * 0.5 + 0.5) * root.clientHeight;
      return (
        x > root.clientWidth * 0.42 &&
        x < root.clientWidth * 0.92 &&
        y > 80 &&
        y < window.innerHeight * 0.9
      );
    };

    const addCard = (time: number) => {
      let point: GlobePoint | undefined;
      let name: string | undefined;

      for (let attempt = 0; attempt < 60 && !point; attempt += 1) {
        const named = namedSchools.length
          ? namedSchools[Math.floor(random() * namedSchools.length)]
          : undefined;
        const candidate = named
          ? {
              kind: STATUS[named.status] ?? 'unknown',
              latitude: named.latitude,
              longitude: named.longitude,
              seed: random(),
            }
          : points[Math.floor(random() * points.length)];

        if (candidate?.kind !== 'land' && isFacingCamera(candidate)) {
          point = candidate;
          name = named?.name;
        }
      }
      if (!point) return;

      const colors = getGlobeColors();
      const element = createCard(
        labels,
        point,
        colors.status[point.kind as Status],
        name,
      );
      cardsLayer.append(element);
      liveCards.push({
        element,
        expiresAt: time + 4.5 + random() * 2,
        point,
      });
      lastCardAt = time;
      requestAnimationFrame(() => element.classList.add('is-visible'));
    };

    const updateCards = (time: number) => {
      if (
        !reducedMotion &&
        liveCards.length < MAX_CARDS &&
        time - lastCardAt > 1.3
      ) {
        addCard(time);
      }

      for (let index = liveCards.length - 1; index >= 0; index -= 1) {
        const card = liveCards[index];
        projected
          .fromArray(toVector(card.point.longitude, card.point.latitude))
          .applyMatrix4(globe.matrixWorld)
          .project(camera);
        const cardWidth = card.element.offsetWidth;
        const cardHeight = card.element.offsetHeight;
        const projectedX = (projected.x * 0.5 + 0.5) * root.clientWidth;
        const projectedY = (-projected.y * 0.5 + 0.5) * root.clientHeight;
        const x = Math.min(
          root.clientWidth - cardWidth / 2 - 12,
          Math.max(root.clientWidth * 0.42, projectedX),
        );
        const y = Math.min(
          window.innerHeight - cardHeight - 20,
          Math.max(cardHeight * 1.6 + 64, projectedY),
        );
        card.element.style.left = `${x}px`;
        card.element.style.top = `${y}px`;

        if (time > card.expiresAt - 0.5) {
          card.element.classList.remove('is-visible');
        }
        if (time > card.expiresAt) {
          card.element.remove();
          liveCards.splice(index, 1);
        }
      }
    };

    const baseRotation = -((FOCUS_LONGITUDE + 90) * Math.PI) / 180;
    const renderFrame = (timestamp: number) => {
      if (dataReady && animationStartedAt === undefined) {
        animationStartedAt = timestamp;
      }
      const time =
        animationStartedAt !== undefined
          ? Math.max(0, timestamp - animationStartedAt) / 1000
          : 0;
      globe.rotation.x = (FOCUS_LATITUDE * Math.PI) / 180;
      // Cosine rather than sine so the drift starts and turns at zero speed,
      // and so t=0 still frames FOCUS_LONGITUDE like the reduced-motion pose.
      globe.rotation.y =
        baseRotation +
        (reducedMotion
          ? 0
          : SWAY * 0.5 * (1 - Math.cos((time * 2 * Math.PI) / SWAY_PERIOD)));
      globe.updateMatrixWorld();
      pointMaterial.uniforms.time.value = reducedMotion ? 0 : time;
      if (dataReady) updateCards(time);
      renderer.render(scene, camera);

      if (dataReady && !readyReported) {
        readyReported = true;
        markHeroGlobe('hero-globe:first-frame');
        onReady();
      }
    };

    const animationLoop = (timestamp: number) => {
      if (timestamp - lastFrameAt < FRAME_INTERVAL) return;
      lastFrameAt = timestamp;
      renderFrame(timestamp);
    };

    const updateLoop = () => {
      const shouldAnimate =
        isIntersecting && isDocumentVisible && !reducedMotion;
      if (shouldAnimate && !isLoopRunning) {
        renderer.setAnimationLoop(animationLoop);
        isLoopRunning = true;
      } else if (!shouldAnimate && isLoopRunning) {
        renderer.setAnimationLoop(null);
        isLoopRunning = false;
      }

      if (isIntersecting && isDocumentVisible && reducedMotion) {
        renderFrame(performance.now());
      }
    };

    const resize = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const stageViewports = height / window.innerHeight;
      camera.fov =
        (2 *
          Math.atan((HALF_VIEWPORT_HEIGHT * stageViewports) / CAMERA_DISTANCE) *
          180) /
        Math.PI;
      camera.updateProjectionMatrix();
      globe.position.set(
        GLOBE_POSITION[0],
        GLOBE_POSITION[1] + HALF_VIEWPORT_HEIGHT * (stageViewports - 1),
        0,
      );
      renderFrame(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      updateLoop();
    });
    intersectionObserver.observe(root);

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState !== 'hidden';
      updateLoop();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    const updateReducedMotion = () => {
      reducedMotion = reducedMotionQuery.matches;
      if (reducedMotion) cardsLayer.replaceChildren();
      updateLoop();
    };
    reducedMotionQuery.addEventListener('change', updateReducedMotion);

    const namesTimer = window.setTimeout(() => {
      void loadHeroGlobeNames().then((names) => {
        if (!disposed) namedSchools = names;
      });
    }, 2000);

    void loadHeroGlobeBuffers()
      .then(({ land, schools }) => {
        if (disposed) return;
        points = parseBuffers(land, schools);
        rebuildPoints();
        dataReady = true;
        renderFrame(performance.now());
      })
      .catch(() => {
        if (!disposed) onUnavailable();
      });

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    resize();
    updateLoop();

    return () => {
      disposed = true;
      window.clearTimeout(namesTimer);
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', updateReducedMotion);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      liveCards.forEach(({ element }) => element.remove());
      pointsObject?.geometry.dispose();
      pointMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      cardsLayer.remove();
    };
  }, [labels, onReady, onUnavailable]);

  return <div aria-hidden="true" className="hero-globe-scene" ref={rootRef} />;
}
