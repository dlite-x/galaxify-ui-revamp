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

  // Animate rotation
  useFrame((state, delta) => {
    if (meshRef.current && planetType === "earth") {
      // Earth spins around its Z-axis (north-south pole) correctly
      // Since we rotated the sphere to align north pole with +Z, we rotate around Z
      meshRef.current.rotation.z += delta * 0.1; // Slower, more realistic Earth rotation
    } else if (meshRef.current) {
      // For other planets, normal rotation
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.1;
    }
    if (selected && ringRef.current) {
      ringRef.current.rotation.z += delta * 2; // Spin selection ring
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.2; // Slow atmosphere drift
    }
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
      {/* Coordinate System - only for Earth */}
      {planetType === "earth" && (
        <group>
          {/* X axis - Red */}
          <mesh position={[size * 0.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.005, 0.005, size * 0.6, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <mesh position={[size * 1.1, 0, 0]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          
          {/* Y axis - Green */}
          <mesh position={[0, size * 0.8, 0]}>
            <cylinderGeometry args={[0.005, 0.005, size * 0.6, 8]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          <mesh position={[0, size * 1.1, 0]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          
          {/* Z axis - Blue */}
          <mesh position={[0, 0, size * 0.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, size * 0.6, 8]} />
            <meshBasicMaterial color="#0000ff" />
          </mesh>
          <mesh position={[0, 0, size * 1.1]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.02, 0.08, 8]} />
            <meshBasicMaterial color="#0000ff" />
          </mesh>
        </group>
      )}

      {/* Single Planet Sphere - Properly oriented */}
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        rotation={planetType === "earth" ? [-Math.PI / 2, 0, 0] : [0, 0, 0]} // Rotate Earth so north pole points to +Z
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