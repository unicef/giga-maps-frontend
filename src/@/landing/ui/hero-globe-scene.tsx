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

import { isProduction } from '~/env';

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
// Globe is offset right, so the framed band is west of centre: 55 = Africa.
const FOCUS_LONGITUDE = 55;
const FOCUS_LATITUDE = -9;
// One-sided westward excursion, not a symmetric amplitude: ends at -20 = Brazil.
const SWAY = (75 * Math.PI) / 180;
const SWAY_PERIOD = 120;
const PULSE_PERIOD = 2.4;
// Halo radius; fragment cost scales with its square and the dot size is unaffected.
const PULSE_GROW = 0.8;
const CAMERA_DISTANCE = 4.4;
const INITIAL_FOV = 32;
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

    // Read per frame so the ?tune panel can drive them live.
    const settings = {
      cameraDistance: CAMERA_DISTANCE,
      focusLatitude: FOCUS_LATITUDE,
      focusLongitude: FOCUS_LONGITUDE,
      globeScale: GLOBE_SCALE,
      globeX: GLOBE_POSITION[0],
      globeY: GLOBE_POSITION[1],
      pulseGrow: PULSE_GROW,
      pulsePeriod: PULSE_PERIOD,
      showPlanet: true,
      swayDegrees: (SWAY * 180) / Math.PI,
      swayPeriod: SWAY_PERIOD,
    };

    const scene = new Scene();
    const camera = new PerspectiveCamera(INITIAL_FOV, 1, 0.1, 100);

    const globe = new Group();
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
    const sphereMesh = new Mesh(sphereGeometry, sphereMaterial);
    globe.add(sphereMesh);

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
      name?: string;
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
        // Later attempts go anonymous so a short list cannot fill every card.
        const named =
          namedSchools.length && attempt < 30
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

        if (candidate?.kind === 'land' || !isFacingCamera(candidate)) continue;
        const isOnScreen = liveCards.some((card) =>
          named
            ? card.name === named.name
            : card.point.latitude === candidate.latitude &&
              card.point.longitude === candidate.longitude,
        );
        if (isOnScreen) continue;

        point = candidate;
        name = named?.name;
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
        name,
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

    const renderFrame = (timestamp: number) => {
      if (dataReady && animationStartedAt === undefined) {
        animationStartedAt = timestamp;
      }
      const time =
        animationStartedAt !== undefined
          ? Math.max(0, timestamp - animationStartedAt) / 1000
          : 0;
      globe.rotation.x = (settings.focusLatitude * Math.PI) / 180;
      // Cosine, not sine: turns at zero speed and t=0 matches the reduced-motion pose.
      globe.rotation.y =
        -((settings.focusLongitude + 90) * Math.PI) / 180 +
        (reducedMotion
          ? 0
          : ((settings.swayDegrees * Math.PI) / 180) *
            0.5 *
            (1 - Math.cos((time * 2 * Math.PI) / settings.swayPeriod)));
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
      camera.position.z = settings.cameraDistance;
      globe.scale.setScalar(settings.globeScale);
      const halfViewportHeight =
        settings.cameraDistance * Math.tan((INITIAL_FOV / 2) * (Math.PI / 180));
      const stageViewports = height / window.innerHeight;
      camera.fov =
        (2 *
          Math.atan(
            (halfViewportHeight * stageViewports) / settings.cameraDistance,
          ) *
          180) /
        Math.PI;
      camera.updateProjectionMatrix();
      globe.position.set(
        settings.globeX,
        settings.globeY + halfViewportHeight * (stageViewports - 1),
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

    // Temporary ?tune panel; delete with the lil-gui dependency once tuned.
    let panel: { destroy: () => void } | undefined;
    const tuningRequested =
      !isProduction && new URLSearchParams(window.location.search).has('tune');
    if (tuningRequested) {
      void import('lil-gui').then(({ GUI }) => {
        if (disposed) return;
        const gui = new GUI({ title: 'Hero globe' });
        panel = gui;
        const redraw = () => renderFrame(performance.now());

        const rotation = gui.addFolder('Rotation');
        rotation
          .add(settings, 'focusLongitude', -180, 180, 1)
          .name('focus lon')
          .onChange(redraw);
        rotation
          .add(settings, 'focusLatitude', -60, 60, 1)
          .name('focus lat')
          .onChange(redraw);
        rotation
          .add(settings, 'swayDegrees', 0, 180, 1)
          .name('sway west (deg)');
        rotation
          .add(settings, 'swayPeriod', 10, 300, 5)
          .name('sway period (s)');

        const framing = gui.addFolder('Framing');
        framing
          .add(settings, 'cameraDistance', 2.5, 8, 0.05)
          .name('camera z')
          .onChange(resize);
        framing
          .add(settings, 'globeScale', 1, 4, 0.05)
          .name('scale')
          .onChange(resize);
        framing.add(settings, 'globeX', -2, 2, 0.05).name('x').onChange(resize);
        framing.add(settings, 'globeY', -2, 2, 0.05).name('y').onChange(resize);

        const dots = gui.addFolder('Dots');
        dots
          .add(settings, 'pulseGrow', 0.5, 6, 0.1)
          .name('glow radius')
          .onChange((value: number) => {
            pointMaterial.uniforms.pulseGrow.value = value;
            redraw();
          });
        dots
          .add(settings, 'pulsePeriod', 0.5, 8, 0.1)
          .name('pulse period (s)')
          .onChange((value: number) => {
            pointMaterial.uniforms.pulsePeriod.value = value;
          });

        const planet = gui.addFolder('Planet');
        planet
          .add(settings, 'showPlanet')
          .name('show body')
          .onChange((value: boolean) => {
            sphereMaterial.colorWrite = value;
            redraw();
          });
        planet.addColor(GLOBE_COLOR, 'ocean').onChange((value: string) => {
          sphereMaterial.uniforms.ocean.value.set(value);
          redraw();
        });
        planet.addColor(GLOBE_COLOR, 'rim').onChange((value: string) => {
          sphereMaterial.uniforms.rim.value.set(value);
          redraw();
        });
        // Recolouring the points rebuilds 450k vertices, so wait for release.
        planet.addColor(GLOBE_COLOR, 'land').onFinishChange(() => {
          rebuildPoints();
          redraw();
        });
      });
    }

    resize();
    updateLoop();

    return () => {
      disposed = true;
      panel?.destroy();
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
