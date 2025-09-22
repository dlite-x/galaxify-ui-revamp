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
            color="#1a365d" // Deep ocean blue
            emissive="#0a1420"
            shininess={150}
            specular="#ffffff"
            reflectivity={0.8}
          />
        );
      case "colonized":
        return (
          <meshPhongMaterial
            color="#a0522d" // Mars sienna brown-red
            emissive="#2d1810"  
            shininess={20}
            specular="#cd853f"
          />
        );
      case "unexplored":
        return (
          <meshPhongMaterial
            color="#696969" // Moon dark gray
            emissive="#0f0f0f"
            shininess={5}
            specular="#a9a9a9"
          />
        );
      case "hostile":
        return (
          <meshPhongMaterial
            color="#daa520" // Jupiter golden rod
            emissive="#2f1b14"
            shininess={80}
            specular="#ffd700"
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

      {/* Earth - Continental landmasses and clouds */}
      {planetType === "earth" && (
        <>
          {/* Green and brown continents */}
          <Sphere args={[size * 1.001, 64, 64]}>
            <meshPhongMaterial
              color="#228b22" // Forest green
              emissive="#0f2e0f"
              transparent
              opacity={0.8}
              shininess={50}
            />
          </Sphere>
          {/* Desert and landmasses */}
          <Sphere args={[size * 1.002, 32, 32]}>
            <meshPhongMaterial
              color="#daa520" // Sandy desert color
              emissive="#1a1410"
              transparent
              opacity={0.6}
            />
          </Sphere>
          {/* Wispy white clouds */}
          <Sphere ref={atmosphereRef} args={[size * 1.005, 24, 24]}>
            <meshBasicMaterial
              color="#f0f8ff"
              transparent
              opacity={0.3}
            />
          </Sphere>
          {/* Blue atmospheric halo */}
          <Sphere args={[size * 1.08, 32, 32]}>
            <meshBasicMaterial
              color="#87ceeb"
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
      )}

      {/* Mars - Varied surface with polar caps */}
      {planetType === "colonized" && (
        <>
          {/* Darker regions (ancient impact basins) */}
          <Sphere args={[size * 1.001, 32, 32]}>
            <meshPhongMaterial
              color="#8b4513" // Saddle brown
              emissive="#1a0f0a"
              transparent
              opacity={0.7}
            />
          </Sphere>
          {/* White polar ice caps */}
          <Sphere args={[size * 1.003, 16, 16]}>
            <meshPhongMaterial
              color="#fffafa" // Snow white
              transparent
              opacity={0.6}
              shininess={100}
            />
          </Sphere>
        </>
      )}

      {/* Moon - Realistic crater patterns */}
      {planetType === "unexplored" && (
        <>
          {/* Dark maria (ancient lava flows) */}
          <Sphere args={[size * 1.001, 32, 32]}>
            <meshPhongMaterial
              color="#2f4f4f" // Dark slate gray
              emissive="#0a0a0a"
              transparent
              opacity={0.8}
            />
          </Sphere>
          {/* Bright crater rims */}
          <Sphere args={[size * 1.002, 16, 16]}>
            <meshPhongMaterial
              color="#c0c0c0" // Silver
              transparent
              opacity={0.4}
              shininess={30}
            />
          </Sphere>
        </>
      )}

      {/* Jupiter - Gas bands and Great Red Spot */}
      {planetType === "hostile" && (
        <>
          {/* Dark storm bands */}
          <Sphere args={[size * 1.002, 64, 64]}>
            <meshPhongMaterial
              color="#8b4513" // Saddle brown bands
              emissive="#1a0f0a"
              transparent
              opacity={0.7}
            />
          </Sphere>
          {/* Great Red Spot */}
          <Sphere args={[size * 1.004, 32, 32]}>
            <meshPhongMaterial
              color="#cd5c5c" // Indian red
              emissive="#2d1212"
              transparent
              opacity={0.6}
            />
          </Sphere>
          {/* Thick gas atmosphere */}
          <Sphere args={[size * 1.12, 32, 32]}>
            <meshBasicMaterial
              color="#daa520"
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