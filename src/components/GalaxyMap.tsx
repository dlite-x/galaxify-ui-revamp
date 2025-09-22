import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Planet3D } from "./Planet3D";

interface Planet {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  type: "earth" | "colonized" | "unexplored" | "hostile";
  owner?: string;
}

const planets: Planet[] = [
  { id: "earth", name: "Earth", x: 0, y: 0, z: 0, type: "earth", owner: "player" },
  { id: "mars", name: "Mars", x: 3, y: 1, z: -2, type: "colonized", owner: "player" },
  { id: "alpha", name: "Alpha Centauri", x: -4, y: 2, z: 1, type: "unexplored" },
  { id: "beta", name: "Beta System", x: 2, y: -3, z: 2, type: "hostile" },
  { id: "gamma", name: "Gamma Sector", x: -2, y: -1, z: -3, type: "unexplored" },
];

export const GalaxyMap = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background via-surface to-background overflow-hidden">
      {/* 3D Galaxy Scene */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#4A90E2" intensity={0.5} />

          {/* Background stars */}
          <Stars radius={300} depth={60} count={1000} factor={7} />

          {/* Planets */}
          {planets.map((planet) => (
            <Planet3D
              key={planet.id}
              planetType={planet.type}
              position={[planet.x, planet.y, planet.z]}
              size={planet.type === "earth" ? 0.4 : 0.3}
              onClick={() => setSelectedPlanet(planet)}
              selected={selectedPlanet?.id === planet.id}
            />
          ))}

          {/* Orbit controls for camera */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.8}
            rotateSpeed={0.4}
            minDistance={3}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-xs text-muted-foreground bg-surface/80 px-3 py-2 rounded-lg backdrop-blur-sm">
        Click and drag to rotate • Scroll to zoom • Click planets to select
      </div>

      {/* Selection info */}
      {selectedPlanet && (
        <div className="absolute bottom-4 left-4 game-panel p-4 min-w-64 z-10">
          <h3 className="text-lg font-bold text-foreground mb-2">{selectedPlanet.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="text-foreground capitalize">{selectedPlanet.type}</span>
            </div>
            {selectedPlanet.owner && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Control:</span>
                <span className="text-primary">Player</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance:</span>
              <span className="text-foreground">
                {Math.round(Math.sqrt(selectedPlanet.x ** 2 + selectedPlanet.y ** 2 + selectedPlanet.z ** 2) * 10) / 10} AU
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};