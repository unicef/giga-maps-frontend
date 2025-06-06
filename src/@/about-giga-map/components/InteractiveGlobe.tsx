import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

// Sample school data with coordinates for demonstration - representing global school connectivity
const schoolLocations = [
  { lat: 40.7128, lng: -74.0060, name: 'New York', status: 'Connected', count: 1250 },
  { lat: 51.5074, lng: -0.1278, name: 'London', status: 'Connected', count: 987 },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo', status: 'Disconnected', count: 756 },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney', status: 'Connected', count: 432 },
  { lat: 55.7558, lng: 37.6176, name: 'Moscow', status: 'Disconnected', count: 678 },
  { lat: 28.6139, lng: 77.2090, name: 'New Delhi', status: 'Connected', count: 2100 },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo', status: 'Connected', count: 890 },
  { lat: 19.4326, lng: -99.1332, name: 'Mexico City', status: 'Disconnected', count: 543 },
  { lat: 30.0444, lng: 31.2357, name: 'Cairo', status: 'Connected', count: 675 },
  { lat: -26.2041, lng: 28.0473, name: 'Johannesburg', status: 'Disconnected', count: 234 },
  { lat: 1.3521, lng: 103.8198, name: 'Singapore', status: 'Connected', count: 198 },
  { lat: 25.2048, lng: 55.2708, name: 'Dubai', status: 'Connected', count: 156 },
  { lat: 52.5200, lng: 13.4050, name: 'Berlin', status: 'Connected', count: 445 },
  { lat: 48.8566, lng: 2.3522, name: 'Paris', status: 'Connected', count: 567 },
  { lat: 41.9028, lng: 12.4964, name: 'Rome', status: 'Disconnected', count: 398 },
  { lat: 39.9042, lng: 116.4074, name: 'Beijing', status: 'Connected', count: 1876 },
  { lat: 22.3193, lng: 114.1694, name: 'Hong Kong', status: 'Connected', count: 289 },
  { lat: -1.2921, lng: 36.8219, name: 'Nairobi', status: 'Disconnected', count: 456 },
  { lat: 6.5244, lng: 3.3792, name: 'Lagos', status: 'Connected', count: 789 },
  { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires', status: 'Connected', count: 612 },
  { lat: 13.7563, lng: 100.5018, name: 'Bangkok', status: 'Connected', count: 534 },
  { lat: -15.7975, lng: -47.8919, name: 'Brasília', status: 'Partial', count: 345 },
  { lat: 55.7558, lng: 12.5669, name: 'Copenhagen', status: 'Connected', count: 187 },
  { lat: 59.9139, lng: 10.7522, name: 'Oslo', status: 'Connected', count: 143 },
  { lat: -36.8485, lng: 174.7633, name: 'Auckland', status: 'Connected', count: 298 },
  { lat: 45.4215, lng: -75.6972, name: 'Ottawa', status: 'Connected', count: 267 },
  { lat: 37.5665, lng: 126.9780, name: 'Seoul', status: 'Connected', count: 1123 },
  { lat: 31.2304, lng: 121.4737, name: 'Shanghai', status: 'Connected', count: 1567 },
  { lat: 14.5995, lng: 120.9842, name: 'Manila', status: 'Disconnected', count: 876 },
  { lat: 3.1390, lng: 101.6869, name: 'Kuala Lumpur', status: 'Connected', count: 445 },
];

const InteractiveGlobeWrapper = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  background: radial-gradient(circle, rgba(39, 122, 255, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
  border-radius: 12px;
  overflow: visible;
  cursor: grab;
  margin-top: 20px;
  z-index: 1;

  &:active {
    cursor: grabbing;
  }

  canvas {
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    height: 400px;
    margin-top: 10px;
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10;
  transform: translate(-50%, -100%);
  border: 1px solid rgba(39, 122, 255, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

interface InteractiveGlobeProps {
  className?: string;
}

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const globeRef = useRef<THREE.Mesh>();
  const animationIdRef = useRef<number>();
  const pointsRef = useRef<THREE.Points[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });

  // Convert lat/lng to 3D coordinates
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  };

  // Create realistic Earth using external NASA textures
  const createEarthTextures = () => {
    const loader = new THREE.TextureLoader();

    // Use external NASA texture URLs
    const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg');
    const bumpTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');

    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    return { earthTexture, bumpTexture };
  };

  // Create glowing points for schools
  const createSchoolPoints = () => {
    pointsRef.current = [];

    schoolLocations.forEach((school, index) => {
      const position = latLngToVector3(school.lat, school.lng, 1.02);

      // Create geometry for the point
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([position.x, position.y, position.z]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      // Create material with different colors for different statuses
      const color = school.status === 'Connected' ? '#00ff88' :
        school.status === 'Disconnected' ? '#ff4444' : '#ffaa00';
      const pointSize = Math.max(0.015, Math.min(0.03, school.count / 40000));

      const material = new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size: pointSize,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.8,
      });

      const point = new THREE.Points(geometry, material);
      point.userData = { school, index };

      // Add glow effect
      const glowGeometry = new THREE.BufferGeometry();
      glowGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      const glowMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(color),
        size: pointSize * 2,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Points(glowGeometry, glowMaterial);

      sceneRef.current?.add(point);
      sceneRef.current?.add(glow);
      pointsRef.current.push(point);
    });
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2.5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create globe with realistic textures
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const { earthTexture, bumpTexture } = createEarthTextures();

    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.005,
      transparent: true,
      opacity: 1.0,
    });

    const globe = new THREE.Mesh(geometry, material);
    globeRef.current = globe;
    scene.add(globe);

    // Add professional lighting
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create school points
    createSchoolPoints();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (globeRef.current && !isDragging) {
        globeRef.current.rotation.y += 0.002;
      }

      // Animate point glow
      const time = Date.now() * 0.005;
      pointsRef.current.forEach((point, index) => {
        const material = point.material as THREE.PointsMaterial;
        material.opacity = 0.8 + Math.sin(time + index) * 0.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDragging]);

  // Mouse interaction handlers
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setPreviousMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!globeRef.current || !cameraRef.current || !rendererRef.current) return;

    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (isDragging) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          (deltaMove.y * 0.01),
          (deltaMove.x * 0.01),
          0,
          'XYZ'
        ));

      globeRef.current.quaternion.multiplyQuaternions(deltaRotationQuaternion, globeRef.current.quaternion);
      setPreviousMousePosition({ x: event.clientX, y: event.clientY });
    } else {
      // Raycasting for hover effects
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(pointsRef.current);

      if (intersects.length > 0) {
        const intersectedPoint = intersects[0].object;
        const school = intersectedPoint.userData.school;

        setTooltip({
          visible: true,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          content: `${school.name} - ${school.count} schools - ${school.status}`
        });
      } else {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <InteractiveGlobeWrapper
      className={className}
      ref={mountRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {tooltip.visible && (
        <TooltipWrapper
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.content}
        </TooltipWrapper>
      )}
    </InteractiveGlobeWrapper>
  );
};

export default InteractiveGlobe; 