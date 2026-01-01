import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, OrbitControls, Sparkles, PointMaterial, Points, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Snow({ count = 1500, color, speed = 1 }) {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;     // X: Melebar ke samping
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25; // Y: Atas ke Bawah (Area lebih luas)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25; // Z: Kedalaman
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {

        positions[i * 3 + 1] -= delta * (0.5 + Math.random() * 0.5) * speed;

        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002;

        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = 10;

          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={points} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function AnimatedGlob({ color, speed = 1, distort = 0.5, scale = 1, position = [0, 0, 0] }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3 * speed;
    }
  });

  return (
    <Sphere args={[1, 64, 64]} scale={scale} position={position} ref={meshRef}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={0.5}
        clearcoat={0.3}
        clearcoatRoughness={0.1}
        metalness={0.1}
        roughness={0.2}
        distort={distort}
        speed={2 * speed}
      />
    </Sphere>
  );
}

export default function Scene({ theme }) {
  const isDark = theme === 'dark';

  // Refined Theme Colors
  // Light Mode: Royal Blue / Indigo / Slate - purely premium & business-like
  // Dark Mode: Deep Purple / Neon Pink / Cyan - cyber futuristic

  const palette = isDark ? {
    primary: "#8b5cf6", // Violet 500
    secondary: "#ec4899", // Pink 500
    tertiary: "#06b6d4", // Cyan 500
    snow: "#ffffff" // White Snow
  } : {
    primary: "#6366f1", // Indigo 500 - Vibrant but professional
    secondary: "#3b82f6", // Blue 500
    tertiary: "#94a3b8", // Slate 400
    snow: "#000000" // Slate 300 - Visible against light bg
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <ambientLight intensity={isDark ? 0.6 : 1.5} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 2 : 1} color={palette.primary} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 2 : 0.5} color={palette.secondary} />

      {/* Light for definition in light mode */}
      {!isDark && <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        {/* Shift content to the right */}
        <group position={[3.5, 0, 0]}>
          {/* Central Organic Core */}
          <AnimatedGlob
            scale={1.8}
            color={palette.primary}
            distort={0.4}
            speed={0.8}
          />

          {/* Secondary floating blobs for depth */}
          <AnimatedGlob
            scale={0.5}
            position={[3, 2, -2]}
            color={palette.secondary}
            distort={0.6}
            speed={1.2}
          />
          <AnimatedGlob
            scale={0.4}
            position={[-3, -2, 1]}
            color={palette.tertiary}
            distort={0.5}
            speed={1.0}
          />
        </group>

        {/* Snow Effect */}
        <Snow color={palette.snow} count={1500} />
      </Float>
    </>
  );
}
