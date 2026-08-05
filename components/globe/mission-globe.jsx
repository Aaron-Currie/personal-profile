'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html, useTexture } from '@react-three/drei';
import Link from 'next/link';
import * as THREE from 'three';
import styles from './mission-globe.module.css';

const R = 1.62;

const QUALITY_PRESETS = {
  high: {
    starsNear: 6400,
    starsFar: 1800,
    linkSegments: 100,
    arcHeight: 0.31,
    pulseSpeed: 0.013,
  },
  medium: {
    starsNear: 4200,
    starsFar: 1200,
    linkSegments: 72,
    arcHeight: 0.27,
    pulseSpeed: 0.011,
  },
  low: {
    starsNear: 2200,
    starsFar: 480,
    linkSegments: 46,
    arcHeight: 0.22,
    pulseSpeed: 0.009,
  },
};

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
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (-lng * Math.PI) / 180;
  return new THREE.Vector3(
    r * Math.cos(latRad) * Math.cos(lonRad),
    r * Math.sin(latRad),
    r * Math.cos(latRad) * Math.sin(lonRad)
  );
}

function buildMissionLinks(missions) {
  if (!missions?.length) return [];
  if (missions.length === 1) return [];

  const links = [];

  for (let i = 0; i < missions.length - 1; i += 1) {
    links.push({ from: missions[i], to: missions[i + 1], kind: 'primary' });
  }

  if (missions.length > 2) {
    links.push({
      from: missions[missions.length - 1],
      to: missions[0],
      kind: 'primary',
    });
  }

  if (missions.length > 3) {
    for (let i = 0; i < missions.length; i += 2) {
      links.push({
        from: missions[i],
        to: missions[(i + 2) % missions.length],
        kind: 'secondary',
      });
    }
  }

  return links;
}

function useQualityTier() {
  const [tier, setTier] = useState('high');

  useEffect(() => {
    const updateTier = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const width = window.innerWidth;
      const memory = navigator.deviceMemory || 8;
      const threads = navigator.hardwareConcurrency || 8;

      if (prefersReduced || width < 640 || memory <= 4 || threads <= 4) {
        setTier('low');
        return;
      }
      if (width < 980 || memory <= 6) {
        setTier('medium');
        return;
      }
      setTier('high');
    };

    updateTier();
    window.addEventListener('resize', updateTier);
    return () => window.removeEventListener('resize', updateTier);
  }, []);

  return QUALITY_PRESETS[tier];
}

// ----- Tactical lat/lon grid -----
function GlobeGrid({ lowPower }) {
  const lines = useMemo(() => {
    const out = [];
    const n = lowPower ? 42 : 70;
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
          lineWidth={lowPower ? 0.32 : 0.55}
          transparent
          opacity={lowPower ? 0.1 : 0.14}
        />
      ))}
    </>
  );
}

// ----- Globe sphere with earth texture -----
function GlobeMesh({ globeRef, lowPower }) {
  const { gl } = useThree();
  const [earthTexture, glowTexture] = useLoader(THREE.TextureLoader, ['/earth.jpg', '/globe/glow.png']);

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = maxAnisotropy;
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    earthTexture.generateMipmaps = true;
    earthTexture.needsUpdate = true;

    glowTexture.colorSpace = THREE.SRGBColorSpace;
    glowTexture.anisotropy = maxAnisotropy;
    glowTexture.needsUpdate = true;
  }, [earthTexture, gl, glowTexture]);

  return (
    <>
      <mesh ref={globeRef}>
        <sphereGeometry args={[R, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          color="#0d9de8"
          emissive="#00193f"
          emissiveIntensity={0.34}
          roughness={0.7}
          metalness={0.03}
        />
      </mesh>

      <sprite scale={[R * 3.05, R * 3.05, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#4094d7"
          opacity={lowPower ? 0.38 : 0.56}
          transparent
          depthWrite={false}
        />
      </sprite>
    </>
  );
}

function LinkArc({ from, to, quality, phase = 0, muted = false }) {
  const orbRef = useRef();
  const curve = useMemo(() => {
    const a = toVec3(from.lat, from.lng, R + 0.02);
    const b = toVec3(to.lat, to.lng, R + 0.02);
    const dist = a.distanceTo(b);
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize();
    const arcHeight = quality.arcHeight + dist * 0.04;
    const apex = mid.multiplyScalar(R + arcHeight);

    return new THREE.QuadraticBezierCurve3(a, apex, b);
  }, [from.lat, from.lng, quality.arcHeight, to.lat, to.lng]);

  const points = useMemo(
    () => curve.getPoints(quality.linkSegments),
    [curve, quality.linkSegments]
  );

  const flyOffset = useMemo(() => Math.random(), []);

  useFrame(({ clock }) => {
    if (!orbRef.current) return;
    const t = (clock.getElapsedTime() * (muted ? 0.035 : 0.07) + phase + flyOffset) % 1;
    orbRef.current.position.copy(curve.getPointAt(t));
  });

  return (
    <group>
      <Line
        points={points}
        color={muted ? '#4f9dbd' : '#f3ae76'}
        transparent
        opacity={muted ? 0.32 : 0.82}
        lineWidth={muted ? 0.58 : 1.06}
      />
      <mesh ref={orbRef}>
        <sphereGeometry args={[muted ? 0.012 : 0.016, 8, 8]} />
        <meshBasicMaterial color={muted ? '#78b8d2' : '#ff8c31'} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

// ----- Single mission marker -----
function Marker({
  mission,
  completed,
  selected,
  onSelect,
  onClose,
  wasDragging,
  globeRef,
  textures,
  quality,
}) {
  const groupRef = useRef();
  const pulseRef = useRef();
  const { camera } = useThree();
  const camDir = useRef(new THREE.Vector3());
  const [hovered, setHovered] = useState(false);
  const position = useMemo(() => toVec3(mission.lat, mission.lng, R * 1.001), [mission.lat, mission.lng]);
  const labelPos = useMemo(() => toVec3(mission.lat, mission.lng, R + 0.115), [mission.lat, mission.lng]);
  const normal = useMemo(() => position.clone().normalize(), [position]);
  const orientation = useMemo(() => {
    const out = new THREE.Quaternion();
    out.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return out;
  }, [normal]);

  const initialFrontFacing = useMemo(() => {
    const currentCamDir = camera.position.clone().normalize();
    return normal.dot(currentCamDir) > 0.1;
  }, [camera.position.x, camera.position.y, camera.position.z, normal]);

  const [isFrontFacing, setIsFrontFacing] = useState(initialFrontFacing);
  const frontFacingRef = useRef(initialFrontFacing);

  useFrame(() => {
    camDir.current.copy(camera.position).normalize();
    const nextVisible = normal.dot(camDir.current) > 0.1;

    if (groupRef.current) {
      groupRef.current.visible = nextVisible;
    }

    if (pulseRef.current) {
      pulseRef.current.userData.scale += quality.pulseSpeed;
      const nextScale = pulseRef.current.userData.scale;
      pulseRef.current.scale.setScalar(pulseRef.current.userData.size * nextScale);
      if (pulseRef.current.material) {
        if (nextScale <= 1.5) {
          pulseRef.current.material.opacity = (nextScale - 1) * 2;
        } else if (nextScale <= 2) {
          pulseRef.current.material.opacity = 1 - (nextScale - 1.5) * 2;
        } else {
          pulseRef.current.userData.scale = 1;
        }
      }
    }

    if (nextVisible !== frontFacingRef.current) {
      frontFacingRef.current = nextVisible;
      setIsFrontFacing(nextVisible);
    }
  });

  useEffect(() => {
    if (!pulseRef.current) return;
    const baseSize = R * 0.125;
    pulseRef.current.userData.size = baseSize;
    pulseRef.current.userData.scale = 1 + Math.random() * 0.8;
    pulseRef.current.scale.setScalar(baseSize * pulseRef.current.userData.scale);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <>
      <group
        ref={groupRef}
        visible={isFrontFacing}
        position={position}
        quaternion={orientation}
        onClick={(e) => {
          if (wasDragging.current || !frontFacingRef.current) return;
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
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[R * 0.086, R * 0.086]} />
          <meshBasicMaterial
            map={textures.label}
            color={completed ? '#6fff93' : selected ? '#ffc17a' : '#4ec5ff'}
            transparent
            depthWrite={false}
          />
        </mesh>

        <mesh ref={pulseRef} position={[0, 0, 0.012]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={textures.aperture}
            color="#e99f68"
            transparent
            depthWrite={false}
            opacity={0.8}
          />
        </mesh>

        <group>
          <mesh position={[0, 0, R * 0.17]}>
            <planeGeometry args={[R * 0.05, R * 0.34]} />
            <meshBasicMaterial
              map={textures.lightColumn}
              color={selected ? '#ffe4bf' : completed ? '#8dffc2' : '#ff7d2d'}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
              opacity={hovered ? 0.95 : 0.82}
            />
          </mesh>
          <mesh position={[0, 0, R * 0.17]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[R * 0.05, R * 0.34]} />
            <meshBasicMaterial
              map={textures.lightColumn}
              color={selected ? '#ffe4bf' : completed ? '#8dffc2' : '#ff7d2d'}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
              opacity={hovered ? 0.95 : 0.82}
            />
          </mesh>
        </group>

        <mesh position={[0, 0, R * 0.16]}>
          <sphereGeometry args={[0.026, 10, 10]} />
          <meshStandardMaterial
            color={completed ? '#8dffc2' : selected ? '#ffd7a8' : '#79d7ff'}
            emissive={selected ? '#d46f1d' : '#0d4371'}
            emissiveIntensity={selected ? 1.2 : 0.85}
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
      </group>

      <Html
        position={labelPos}
        occlude={[globeRef]}
        zIndexRange={[16, 0]}
        distanceFactor={5.8}
        style={{ pointerEvents: isFrontFacing ? 'auto' : 'none', opacity: isFrontFacing ? 1 : 0 }}
      >
        <button
          type="button"
          className={`${styles.label} ${selected ? styles.labelSelected : ''}`}
          onClick={() => {
            if (!wasDragging.current && frontFacingRef.current) {
              onSelect(mission);
            }
          }}
        >
          <span className={styles.labelId}>LOC {String(mission.id).padStart(2, '0')}</span>
          <span>{mission.section}</span>
        </button>
      </Html>

      {selected && (
        <Html
          position={labelPos.clone().multiplyScalar(1.045)}
          occlude={[globeRef]}
          zIndexRange={[20, 0]}
          distanceFactor={5.2}
          style={{ pointerEvents: isFrontFacing ? 'auto' : 'none' }}
        >
          <article className={styles.popover} role="dialog" aria-label={`Mission ${mission.missionTitle}`}>
            <header className={styles.popoverHeader}>
              <p>Mission Target</p>
              <button type="button" className={styles.closePopover} onClick={onClose}>
                x
              </button>
            </header>

            <h3>{mission.missionTitle}</h3>
            <h4>{mission.section}</h4>
            <p>{mission.description}</p>

            <div className={styles.popoverActions}>
              <Link href={`/game/missions${mission.link}`} className={styles.missionAction}>
                {completed ? 'Replay Mission' : 'Launch Mission'}
              </Link>
              {completed && (
                <Link href={`/game/${mission.link}`} className={`${styles.missionAction} ${styles.visitAction}`}>
                  Visit Page
                </Link>
              )}
            </div>
          </article>
        </Html>
      )}
    </>
  );
}

function OrbitRings({ lowPower }) {
  if (lowPower) return null;

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R + 0.33, 0.005, 8, 180]} />
        <meshBasicMaterial color="#1b4f91" transparent opacity={0.26} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[R + 0.46, 0.005, 8, 180]} />
        <meshBasicMaterial color="#517db4" transparent opacity={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, -Math.PI / 8]}>
        <torusGeometry args={[R + 0.21, 0.004, 8, 180]} />
        <meshBasicMaterial color="#9076d8" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

// ----- Scene contents (inside Canvas) -----
function GlobeScene({ missions, pages, onSelect, onClose, selectedMissionId, wasDragging, quality }) {
  const globeRef = useRef();
  const textures = useTexture({
    label: '/globe/label.png',
    aperture: '/globe/aperture.png',
    lightColumn: '/globe/light_column.png',
  });

  const links = useMemo(() => buildMissionLinks(missions), [missions]);

  useEffect(() => {
    textures.label.colorSpace = THREE.SRGBColorSpace;
    textures.aperture.colorSpace = THREE.SRGBColorSpace;
    textures.lightColumn.colorSpace = THREE.SRGBColorSpace;
  }, [textures]);

  useEffect(() => {
    if (!textures?.aperture) return;
    textures.aperture.wrapS = THREE.ClampToEdgeWrapping;
    textures.aperture.wrapT = THREE.ClampToEdgeWrapping;
  }, [textures]);

  const lowPower = quality.starsNear <= QUALITY_PRESETS.low.starsNear;

  return (
    <>
      <color attach="background" args={['#00040a']} />

      <directionalLight position={[4, 2.5, 4]} intensity={0.95} color="#a0e0ff" />
      <ambientLight intensity={0.45} />
      <pointLight position={[-4, -2, -4]} intensity={0.48} color="#0b3d8a" />
      <pointLight position={[0, 5, 2]} intensity={0.28} color="#00aaff" />

      <Stars
        radius={160}
        depth={95}
        count={quality.starsNear}
        factor={5.3}
        saturation={0.72}
        fade
        speed={0.11}
      />
      <Stars
        radius={160}
        depth={95}
        count={quality.starsFar}
        factor={8.4}
        saturation={1}
        fade
        speed={0.22}
      />

      <Suspense
        fallback={
          <mesh ref={globeRef}>
            <sphereGeometry args={[R, 80, 80]} />
            <meshStandardMaterial color="#011535" emissive="#001a38" emissiveIntensity={0.28} roughness={0.8} />
          </mesh>
        }
      >
        <GlobeMesh globeRef={globeRef} lowPower={lowPower} />
      </Suspense>

      <GlobeGrid lowPower={lowPower} />
      <OrbitRings lowPower={lowPower} />

      <mesh>
        <sphereGeometry args={[R + 0.017, 64, 64]} />
        <meshBasicMaterial color="#00d0ff" transparent opacity={0.018} />
      </mesh>

      <mesh>
        <sphereGeometry args={[R + 0.25, 64, 64]} />
        <meshBasicMaterial
          color="#38cfff"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <group>
        {links.map((link, idx) => (
          <LinkArc
            key={`${link.from.id}-${link.to.id}-${idx}`}
            from={link.from}
            to={link.to}
            quality={quality}
            phase={idx * 0.09}
            muted={link.kind === 'secondary'}
          />
        ))}
      </group>

      {missions.map((mission) => {
        const completed = pages.find((p) => p.link === mission.link)?.completed;
        return (
          <Marker
            key={mission.id}
            mission={mission}
            completed={completed}
            selected={selectedMissionId === mission.id}
            onSelect={onSelect}
            onClose={onClose}
            wasDragging={wasDragging}
            globeRef={globeRef}
            textures={textures}
            quality={quality}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom
        zoomSpeed={0.8}
        minDistance={3.8}
        maxDistance={9}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        rotateSpeed={0.7}
        autoRotate
        autoRotateSpeed={0.38}
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
  const quality = useQualityTier();
  const [selectedMissionId, setSelectedMissionId] = useState(null);
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

  const handleSelectMission = (mission) => {
    setSelectedMissionId((prev) => (prev === mission.id ? null : mission.id));
    if (onMissionSelect) onMissionSelect(mission);
  };

  const handleCloseMission = () => {
    setSelectedMissionId(null);
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
          <Canvas
            camera={{ position: [0, 0.3, 6.1], fov: 38 }}
            onPointerMissed={() => setSelectedMissionId(null)}
          >
            <Suspense fallback={null}>
              <SceneReadyPing onReady={handleSceneReady} />
              <GlobeScene
                missions={missions}
                pages={pages}
                onSelect={handleSelectMission}
                onClose={handleCloseMission}
                selectedMissionId={selectedMissionId}
                wasDragging={wasDragging}
                quality={quality}
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
