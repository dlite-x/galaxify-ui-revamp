import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import earthTexture from "../assets/earth-2k-texture.jpg";
import moonTexture from "../assets/moon-texture-2k.jpg";

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

  // Load textures using useTexture from drei
  const earthMap = useTexture(earthTexture);
  const moonMap = useTexture(moonTexture);
  
  // Configure texture wrapping for better quality
  if (earthMap) {
    earthMap.wrapS = earthMap.wrapT = THREE.RepeatWrapping;
  }
  if (moonMap) {
    moonMap.wrapS = moonMap.wrapT = THREE.RepeatWrapping;
  }

  // Animate rotation with realistic speeds
  useFrame((state, delta) => {
    if (meshRef.current && planetType === "earth") {
      // Earth spins around its Z-axis with realistic rotation
      meshRef.current.rotation.z += delta * 0.1; // 24-hour day simulation
    } else if (meshRef.current && planetType === "unexplored") {
      // Moon-like slower rotation (tidally locked simulation)
      meshRef.current.rotation.y += delta * 0.05; // Much slower rotation
    } else if (meshRef.current) {
      // Other planets with varied rotation speeds
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.05;
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
            roughness={0.6}
            metalness={0.05}
            emissive="#111111"
            emissiveIntensity={0.15}
          />
        );
      case "colonized":
        return (
          <meshStandardMaterial
            color="#cd853f" // Mars rust
            roughness={0.8}
            metalness={0.0}
            emissive="#0a0505"
            emissiveIntensity={0.05}
          />
        );
      case "unexplored":
        return (
          <meshStandardMaterial
            map={moonMap}
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
            emissive="#2a1000"
            emissiveIntensity={0.1}
          />
        );
      default:
        return <meshStandardMaterial color="#888888" roughness={0.8} metalness={0.0} />;
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

      {/* High-Quality Planet Sphere */}
      <Sphere
        ref={meshRef}
        args={[
          planetType === "earth" ? size : size, 
          planetType === "earth" || planetType === "unexplored" ? 64 : 32, 
          planetType === "earth" || planetType === "unexplored" ? 64 : 32
        ]}
        rotation={planetType === "earth" ? [0, 0, 0] : [0, 0, 0]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
        castShadow
        receiveShadow
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