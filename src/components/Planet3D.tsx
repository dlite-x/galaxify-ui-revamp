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
            color="#2563eb" // Earth blue oceans
            emissive="#0f172a"
            shininess={100}
            specular="#87CEEB"
          />
        );
      case "colonized":
        return (
          <meshPhongMaterial
            color="#dc2626" // Mars red
            emissive="#451a03"  
            shininess={20}
            specular="#f87171"
          />
        );
      case "unexplored":
        return (
          <meshPhongMaterial
            color="#9ca3af" // Moon gray
            emissive="#1f2937"
            shininess={5}
            specular="#d1d5db"
          />
        );
      case "hostile":
        return (
          <meshPhongMaterial
            color="#f59e0b" // Jupiter golden
            emissive="#92400e"
            shininess={80}
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
        args={[size, 64, 64]}
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

      {/* Earth - Green continents visible on surface */}
      {planetType === "earth" && (
        <>
          {/* Continental landmasses */}
          <Sphere args={[size * 1.002, 32, 32]}>
            <meshPhongMaterial
              color="#16a34a"
              transparent
              opacity={0.7}
              emissive="#052e16"
            />
          </Sphere>
          {/* White cloud swirls */}
          <Sphere ref={atmosphereRef} args={[size * 1.008, 16, 16]}>
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.4}
            />
          </Sphere>
          {/* Blue atmosphere glow */}
          <Sphere args={[size * 1.15, 32, 32]}>
            <meshBasicMaterial
              color="#3b82f6"
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
      )}

      {/* Mars - Polar ice caps and dust storms */}
      {planetType === "colonized" && (
        <>
          {/* White polar caps */}
          <Sphere args={[size * 1.003, 32, 32]}>
            <meshPhongMaterial
              color="#f1f5f9"
              transparent
              opacity={0.6}
            />
          </Sphere>
          {/* Dusty atmosphere */}
          <Sphere args={[size * 1.08, 32, 32]}>
            <meshBasicMaterial
              color="#f59e0b"
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
      )}

      {/* Moon - Dark crater spots */}
      {planetType === "unexplored" && (
        <Sphere args={[size * 1.002, 32, 32]}>
          <meshPhongMaterial
            color="#4b5563"
            transparent
            opacity={0.8}
          />
        </Sphere>
      )}

      {/* Jupiter - Swirling gas bands and Great Red Spot */}
      {planetType === "hostile" && (
        <>
          {/* Dark storm bands */}
          <Sphere args={[size * 1.004, 32, 32]}>
            <meshPhongMaterial
              color="#b91c1c"
              transparent
              opacity={0.6}
              emissive="#450a0a"
            />
          </Sphere>
          {/* Thick gas atmosphere */}
          <Sphere args={[size * 1.2, 32, 32]}>
            <meshBasicMaterial
              color="#fb923c"
              transparent
              opacity={0.2}
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