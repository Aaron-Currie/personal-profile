'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import styles from './mission-globe.module.css';

const R = 1.55;

class GlobeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function toVec3(lat, lng, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// ----- Tactical lat/lon grid -----
function GlobeGrid() {
  const lines = useMemo(() => {
    const out = [];
    const n = 80;
    for (let lat = -75; lat <= 75; lat += 15) {
      if (lat === 0) continue;
      out.push({
        key: `lat${lat}`,
        pts: Array.from({ length: n + 1 }, (_, i) =>
          toVec3(lat, (i / n) * 360 - 180, R + 0.003)
        ),
      });
    }
    for (let lng = -180; lng < 180; lng += 15) {
      if (lng === 0 || lng === 180 || lng === -180) continue;
      out.push({
        key: `lng${lng}`,
        pts: Array.from({ length: n + 1 }, (_, i) =>
          toVec3((i / n) * 180 - 90, lng, R + 0.003)
        ),
      });
    }
    return out;
  }, []);

  return (
    <>
      {lines.map(({ key, pts }) => (
        <Line
          key={key}
          points={pts}
          color="#00d0ff"
          lineWidth={0.55}
          transparent
          opacity={0.14}
        />
      ))}
    </>
  );
}

// ----- Globe sphere with earth texture -----
function GlobeMesh({ globeRef }) {
  const { gl } = useThree();
  const texture = useLoader(THREE.TextureLoader, '/earth.jpg');

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
  }, [gl, texture]);

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[R, 128, 128]} />
      <meshStandardMaterial
        map={texture}
        color="#00d0ff"
        emissive="#010c1eeb"
        emissiveIntensity={0.32}
        roughness={0.72}
        metalness={0.04}
      />
    </mesh>
  );
}

// ----- Single mission marker -----
function Marker({ mission, completed, onSelect, wasDragging, globeRef }) {
  const meshRef = useRef();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [labelHovered, setLabelHovered] = useState(false);
  const isHovered = hovered || labelHovered;

  // Pin sphere sits just above the globe surface
  const pinPos = useMemo(
    () => toVec3(mission.lat, mission.lng, R + 0.07),
    [mission.lat, mission.lng]
  );
  // Outward normal used for back-face test
  const outward = useMemo(() => pinPos.clone().normalize(), [pinPos]);

  const initialFrontFacing = useMemo(() => {
    const camLength = camera.position.length();
    if (!camLength) return false;
    return outward.dot(camera.position) / camLength > 0.12;
  }, [camera.position.x, camera.position.y, camera.position.z, outward]);

  const [isFrontFacing, setIsFrontFacing] = useState(initialFrontFacing);
  const isFrontFacingRef = useRef(initialFrontFacing);

  useFrame(() => {
    const camLength = camera.position.length();
    if (!camLength) return;

    const nextVisible = outward.dot(camera.position) / camLength > 0.12;

    if (meshRef.current) {
      meshRef.current.visible = nextVisible;
    }

    if (nextVisible !== isFrontFacingRef.current) {
      isFrontFacingRef.current = nextVisible;
      setIsFrontFacing(nextVisible);
    }
  });

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <>
      {/* Clickable 3-D sphere – click is wired directly to the mesh */}
      <mesh
        ref={meshRef}
        visible={isFrontFacing}
        position={pinPos}
        onClick={(e) => {
          if (wasDragging.current || !isFrontFacingRef.current) return;
          e.stopPropagation();
          onSelect(mission);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial
          color={completed ? '#14d414' : isHovered ? '#d4f4ff' : '#98d5f6'}
          emissive={completed ? '#065c06' : isHovered ? '#00c8ff' : '#003878'}
          emissiveIntensity={isHovered ? 3.2 : completed ? 1.3 : 0.95}
        />
      </mesh>

      {/* Label – occluded by globe, clickable */}
      <Html
        position={pinPos}
        occlude={[globeRef]}
        zIndexRange={[15, 0]}
        distanceFactor={5}
        style={{ userSelect: 'none', opacity: isFrontFacing ? 1 : 0 }}
      >
        <div
          className={`${styles.label} ${
            completed ? styles.labelComplete : isHovered ? styles.labelHover : ''
          }`}
          style={{
            transform: 'translate(-50%, -145%)',
            pointerEvents: isFrontFacing ? 'auto' : 'none',
          }}
          onClick={() => {
            if (!wasDragging.current && isFrontFacingRef.current) {
              onSelect(mission);
            }
          }}
          onMouseEnter={() => setLabelHovered(true)}
          onMouseLeave={() => setLabelHovered(false)}
        >
          {completed && <span className={styles.check}>✓ </span>}
          {mission.missionTitle}
        </div>
      </Html>
    </>
  );
}

// ----- Scene contents (inside Canvas) -----
function GlobeScene({ missions, pages, onSelect, wasDragging }) {
  const globeRef = useRef();

  return (
    <>
      <color attach="background" args={['#00040a']} />

      {/* Softer key light to reduce extreme day/night contrast */}
      <directionalLight position={[4, 2.5, 4]} intensity={0.95} color="#a0e0ff" />
      <ambientLight intensity={0.5} />
      {/* Dim blue fill on the night side */}
      <pointLight position={[-4, -2, -4]} intensity={0.5} color="#0b3d8a" />
      {/* Cyan rim accent */}
      <pointLight position={[0, 5, 2]} intensity={0.28} color="#00aaff" />

      <Stars radius={160} depth={95} count={8600} factor={5.3} saturation={0.72} fade speed={0.14} />
      <Stars radius={160} depth={95} count={1800} factor={8.4} saturation={1} fade speed={0.28} />

      {/* Globe – earth texture with blue tint; fallback to plain navy while loading */}
      <Suspense
        fallback={
          <mesh ref={globeRef}>
            <sphereGeometry args={[R, 80, 80]} />
            <meshStandardMaterial color="#011535" emissive="#001a38" emissiveIntensity={0.28} roughness={0.8} />
          </mesh>
        }
      >
        <GlobeMesh globeRef={globeRef} />
      </Suspense>

      {/* Tactical lat/lon grid lines */}
      <GlobeGrid />

      {/* Thin inner glow layer just above the surface */}
      <mesh>
        <sphereGeometry args={[R + 0.014, 64, 64]} />
        <meshBasicMaterial color="#00d0ff" transparent opacity={0.018} />
      </mesh>

      {/* Atmosphere rim – BackSide so it glows at the limb */}
      <mesh>
        <sphereGeometry args={[R + 0.24, 64, 64]} />
        <meshBasicMaterial
          color="#38cfff"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer haze layer for depth */}
      <mesh>
        <sphereGeometry args={[R + 0.44, 48, 48]} />
        <meshBasicMaterial color="#0c3f6b" transparent opacity={0.006} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {missions.map((mission) => {
        const completed = pages.find((p) => p.link === mission.link)?.completed;
        return (
          <Marker
            key={mission.id}
            mission={mission}
            completed={completed}
            onSelect={onSelect}
            wasDragging={wasDragging}
            globeRef={globeRef}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom
        zoomSpeed={0.8}
        minDistance={3.6}
        maxDistance={8.8}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        rotateSpeed={0.68}
        autoRotate
        autoRotateSpeed={0.42}
        enableDamping
        dampingFactor={0.055}
      />
    </>
  );
}

function SceneReadyPing({ onReady }) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return null;
}

function FallbackPanel() {
  return (
    <div className={styles.fallback} role="status" aria-live="polite">
      <div className={styles.fallbackBox}>
        <h3>Map Unavailable</h3>
        <p>The 3D globe could not be initialized. Reload the page to try again.</p>
      </div>
    </div>
  );
}

// ----- Root export -----
export default function MissionGlobe({ missions, pages, onMissionSelect }) {
  const wasDragging = useRef(false);
  const dragStart = useRef(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [hasGlobeError, setHasGlobeError] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      setHasGlobeError(true);
    }
  }, []);

  const handleSceneReady = () => {
    setIsSceneReady(true);
  };

  const handleGlobeError = () => {
    setHasGlobeError(true);
  };

  return (
    <div
      className={styles.globeWrapper}
      onPointerDown={(e) => {
        dragStart.current = { x: e.clientX, y: e.clientY };
        wasDragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!dragStart.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (dx * dx + dy * dy > 16) wasDragging.current = true;
      }}
      onPointerUp={() => {
        dragStart.current = null;
      }}
    >
      {!hasGlobeError && (
        <GlobeErrorBoundary onError={handleGlobeError}>
          <Canvas camera={{ position: [0, 0.3, 7.45], fov: 38 }}>
            <Suspense fallback={null}>
              <SceneReadyPing onReady={handleSceneReady} />
              <GlobeScene
                missions={missions}
                pages={pages}
                onSelect={onMissionSelect}
                wasDragging={wasDragging}
              />
            </Suspense>
          </Canvas>
        </GlobeErrorBoundary>
      )}
      {!isSceneReady && !hasGlobeError && (
        <div className={styles.loader} role="status" aria-live="polite">
          <span className={styles.loaderRing} aria-hidden="true" />
          <p>Initializing mission globe...</p>
        </div>
      )}
      {hasGlobeError && <FallbackPanel />}
      <div className={styles.globeVignette} aria-hidden="true" />
    </div>
  );
}
