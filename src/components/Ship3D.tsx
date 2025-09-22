import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import * as THREE from "three";

interface Ship3DProps {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  progress: number; // 0 to 1
  onComplete?: () => void;
}

export const Ship3D = ({ startPosition, endPosition, progress, onComplete }: Ship3DProps) => {
  const shipRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!shipRef.current) return;

    // Calculate curved path (arc between two points)
    const start = new Vector3(...startPosition);
    const end = new Vector3(...endPosition);
    const distance = start.distanceTo(end);
    
    // Create arc control point (slightly above midpoint)
    const midpoint = new Vector3().lerpVectors(start, end, 0.5);
    const height = distance * 0.3; // Arc height
    midpoint.y += height;

    // Quadratic bezier curve
    const currentPos = new Vector3();
    const t = progress;
    const t2 = 1 - t;
    
    currentPos.x = t2 * t2 * start.x + 2 * t2 * t * midpoint.x + t * t * end.x;
    currentPos.y = t2 * t2 * start.y + 2 * t2 * t * midpoint.y + t * t * end.y;
    currentPos.z = t2 * t2 * start.z + 2 * t2 * t * midpoint.z + t * t * end.z;

    shipRef.current.position.copy(currentPos);

    // Calculate direction for ship rotation
    const nextT = Math.min(progress + 0.01, 1);
    const nextPos = new Vector3();
    nextPos.x = (1-nextT) * (1-nextT) * start.x + 2 * (1-nextT) * nextT * midpoint.x + nextT * nextT * end.x;
    nextPos.y = (1-nextT) * (1-nextT) * start.y + 2 * (1-nextT) * nextT * midpoint.y + nextT * nextT * end.y;
    nextPos.z = (1-nextT) * (1-nextT) * start.z + 2 * (1-nextT) * nextT * midpoint.z + nextT * nextT * end.z;

    const direction = new Vector3().subVectors(nextPos, currentPos).normalize();
    shipRef.current.lookAt(currentPos.clone().add(direction));

    // Call completion callback
    if (progress >= 1 && onComplete) {
      onComplete();
    }
  });

  return (
    <group ref={shipRef}>
      {/* Ship body - sleek triangular design */}
      <mesh>
        <coneGeometry args={[0.05, 0.3, 6]} />
        <meshPhongMaterial color="#00d4ff" emissive="#004455" />
      </mesh>
      
      {/* Ship wings */}
      <mesh position={[0, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.15, 0.02, 0.08]} />
        <meshPhongMaterial color="#0099cc" />
      </mesh>
      
      {/* Engine glow */}
      <mesh position={[0, 0, -0.15]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
      </mesh>
      
      {/* Engine trail */}
      <group ref={trailRef}>
        <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.02, 0.2, 8]} />
          <meshBasicMaterial color="#ff3300" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
};