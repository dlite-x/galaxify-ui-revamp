import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

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

  // Animate rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Spin on Y axis
      meshRef.current.rotation.x += delta * 0.1; // Slight wobble
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
          <meshPhongMaterial
            color="#1e40af" // Deep blue oceans
            emissive="#0f172a"
            shininess={100}
            specular="#60a5fa"
          />
        );
      case "colonized":
        return (
          <meshPhongMaterial
            color="#dc2626" // Mars red-orange
            emissive="#7f1d1d"  
            shininess={30}
            specular="#f87171"
          />
        );
      case "unexplored":
        return (
          <meshPhongMaterial
            color="#6b7280" // Moon gray
            emissive="#1f2937"
            shininess={10}
            specular="#9ca3af"
          />
        );
      case "hostile":
        return (
          <meshPhongMaterial
            color="#f59e0b" // Jupiter amber/gold
            emissive="#92400e"
            shininess={60}
            specular="#fbbf24"
          />
        );
      default:
        return <meshBasicMaterial color="#888888" />;
    }
  };

  const getAtmosphereColor = () => {
    switch (planetType) {
      case "earth":
        return "#4169E1"; // Earth's blue atmosphere
      case "colonized":
        return "#CD853F"; // Mars' thin dusty atmosphere
      case "unexplored":
        return "#696969"; // Moon has very faint exosphere
      case "hostile":
        return "#FF8C00"; // Jupiter's thick gas atmosphere
      default:
        return "#666666";
    }
  };

  return (
    <group position={position}>
      {/* Main Planet Body */}
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
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

      {/* Simple atmospheric glow only */}
      {planetType === "earth" && (
        <Sphere args={[size * 1.1, 16, 16]}>
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      )}

      {planetType === "hostile" && (
        <Sphere args={[size * 1.15, 16, 16]}>
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </Sphere>
      )}

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