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

  // Animate rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // Spin on Y axis
      meshRef.current.rotation.x += delta * 0.1; // Slight wobble
    }
    if (selected && ringRef.current) {
      ringRef.current.rotation.z += delta * 2; // Spin selection ring
    }
  });

  const getPlanetMaterial = () => {
    switch (planetType) {
      case "earth":
        return (
          <>
            {/* Earth base surface with continents */}
            <meshPhongMaterial
              color="#1e3a8a" // Deep ocean blue
              emissive="#0f172a"
              shininess={100}
              specular="#87CEEB"
            />
          </>
        );
      case "colonized":
        return (
          <>
            {/* Mars with polar ice caps and surface variations */}
            <meshPhongMaterial
              color="#b91c1c" // Mars red
              emissive="#451a03"  
              shininess={20}
              specular="#dc2626"
            />
          </>
        );
      case "unexplored":
        return (
          <>
            {/* Moon with crater textures */}
            <meshPhongMaterial
              color="#9ca3af" // Moon gray
              emissive="#1f2937"
              shininess={5}
              specular="#d1d5db"
            />
          </>
        );
      case "hostile":
        return (
          <>
            {/* Jupiter with gas bands */}
            <meshPhongMaterial
              color="#d97706" // Jupiter orange
              emissive="#92400e"
              shininess={80}
              specular="#fbbf24"
            />
          </>
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
      {/* Planet core with realistic surface */}
      <Sphere
        ref={meshRef}
        args={[size, 64, 64]} // Higher resolution for detail
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

      {/* Earth continents overlay */}
      {planetType === "earth" && (
        <>
          {/* Green continents */}
          <Sphere args={[size * 1.001, 64, 64]}>
            <meshPhongMaterial
              color="#16a34a"
              transparent
              opacity={0.6}
              emissive="#052e16"
            />
          </Sphere>
          {/* Cloud layer */}
          <Sphere args={[size * 1.02, 32, 32]}>
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.15}
            />
          </Sphere>
        </>
      )}

      {/* Mars dust storms and polar caps */}
      {planetType === "colonized" && (
        <>
          {/* Polar ice caps */}
          <Sphere args={[size * 1.001, 32, 32]}>
            <meshPhongMaterial
              color="#f8fafc"
              transparent
              opacity={0.3}
            />
          </Sphere>
          {/* Dust layer */}
          <Sphere args={[size * 1.005, 32, 32]}>
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.1}
            />
          </Sphere>
        </>
      )}

      {/* Moon crater details */}
      {planetType === "unexplored" && (
        <Sphere args={[size * 1.001, 64, 64]}>
          <meshPhongMaterial
            color="#6b7280"
            transparent
            opacity={0.4}
          />
        </Sphere>
      )}

      {/* Jupiter's Great Red Spot and bands */}
      {planetType === "hostile" && (
        <>
          {/* Gas bands */}
          <Sphere args={[size * 1.001, 64, 64]}>
            <meshPhongMaterial
              color="#ef4444"
              transparent
              opacity={0.3}
              emissive="#7f1d1d"
            />
          </Sphere>
          {/* Storm systems */}
          <Sphere args={[size * 1.005, 32, 32]}>
            <meshBasicMaterial
              color="#fcd34d"
              transparent
              opacity={0.2}
            />
          </Sphere>
        </>
      )}

      {/* Realistic atmospheric layers */}
      {planetType === "earth" && (
        <Sphere args={[size * 1.12, 32, 32]}>
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.25}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Mars' thin CO2 atmosphere */}
      {planetType === "colonized" && (
        <Sphere args={[size * 1.06, 32, 32]}>
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Jupiter's massive atmosphere with multiple layers */}
      {planetType === "hostile" && (
        <>
          {/* Inner atmosphere */}
          <Sphere args={[size * 1.15, 32, 32]}>
            <meshBasicMaterial
              color="#f97316"
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </Sphere>
          {/* Outer atmosphere */}
          <Sphere args={[size * 1.25, 32, 32]}>
            <meshBasicMaterial
              color="#fed7aa"
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
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