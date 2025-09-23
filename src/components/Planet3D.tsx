import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import earthTexture from "../assets/earth-texture.jpg";

interface Planet3DProps {
  planetType: "earth" | "colonized" | "unexplored" | "hostile";
  position: [number, number, number];
  size?: number;
  onClick?: () => void;
  selected?: boolean;
}

export const Planet3D = ({ planetType, position, size = 0.3, onClick, selected }: Planet3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load Earth texture using useTexture from drei
  const earthMap = useTexture(earthTexture);

  // Animate rotation - DISABLED for texture testing
  useFrame((state, delta) => {
    // if (meshRef.current) {
    //   meshRef.current.rotation.y += delta * 0.5; // Spin on Y axis
    //   meshRef.current.rotation.x += delta * 0.1; // Slight wobble
    // }
    if (selected && ringRef.current) {
      ringRef.current.rotation.z += delta * 2; // Spin selection ring
    }
    // if (atmosphereRef.current) {
    //   atmosphereRef.current.rotation.y += delta * 0.2; // Slow atmosphere drift
    // }
  });

  const getPlanetMaterial = () => {
    switch (planetType) {
      case "earth":
        return (
          <meshStandardMaterial
            map={earthMap}
            roughness={0.3}
            metalness={0.1}
          />
        );
      case "colonized":
        return (
          <meshStandardMaterial
            color="#cd853f" // Mars rust
            roughness={0.8}
            metalness={0.0}
          />
        );
      case "unexplored":
        return (
          <meshStandardMaterial
            color="#a9a9a9" // Moon gray
            roughness={0.9}
            metalness={0.0}
          />
        );
      case "hostile":
        return (
          <meshStandardMaterial
            color="#ff8c00" // Jupiter orange
            roughness={0.4}
            metalness={0.2}
          />
        );
      default:
        return <meshStandardMaterial color="#888888" />;
    }
  };

  return (
    <group position={position}>
      {/* Single Planet Sphere - No overlapping */}
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]} // Reduced complexity for clean rendering
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {getPlanetMaterial()}
      </Sphere>

      {/* Selection ring */}
      {selected && (
        <mesh ref={ringRef}>
          <ringGeometry args={[size * 1.3, size * 1.5, 32]} />
          <meshBasicMaterial
            color="#4A90E2"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Subtle orbital ring for colonized planets */}
      {planetType === "colonized" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 1.42, 64]} />
          <meshBasicMaterial
            color="#4A90E2"
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};