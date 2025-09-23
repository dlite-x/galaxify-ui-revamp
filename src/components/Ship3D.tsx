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
      {/* Simple ship body */}
      <mesh>
        <coneGeometry args={[0.04, 0.2, 6]} />
        <meshPhongMaterial color="#00d4ff" />
      </mesh>
      
      {/* Simple engine glow */}
      <mesh position={[0, 0, -0.1]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.7} />
      </mesh>
      
      {/* Simple engine trail spheres */}
      <mesh position={[0, 0, -0.15]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#ff3300" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.2]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color="#ff1100" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};