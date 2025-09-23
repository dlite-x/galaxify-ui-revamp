import { useState, Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Planet3D } from "./Planet3D";
import { Ship3D } from "./Ship3D";
import { Button } from "./ui/button";
import { RotateCcw, Pause, Play } from "lucide-react";

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
  { id: "moon", name: "Luna (Moon)", x: -4, y: 2, z: 1, type: "unexplored" },
  { id: "jupiter", name: "Jupiter", x: 2, y: -3, z: 2, type: "hostile" },
  { id: "europa", name: "Europa", x: -2, y: -1, z: -3, type: "unexplored" },
];

interface ShipRoute {
  id: string;
  startPlanet: Planet;
  endPlanet: Planet;
  progress: number;
  active: boolean;
}

export const GalaxyMap = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [ships, setShips] = useState<ShipRoute[]>([]);
  const [shipsEnabled, setShipsEnabled] = useState<boolean>(true);
  const controlsRef = useRef<any>(null);
  const shipIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Auto-generate some ship routes for demo
  useEffect(() => {
    const createShipRoute = () => {
      if (!shipsEnabled) return;
      
      const availablePlanets = planets.filter(p => p.type !== "hostile");
      if (availablePlanets.length < 2) return;

      const start = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
      let end = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
      while (end.id === start.id) {
        end = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
      }

      const newShip: ShipRoute = {
        id: `ship-${Date.now()}`,
        startPlanet: start,
        endPlanet: end,
        progress: 0,
        active: true
      };

      setShips(prev => [...prev, newShip]);

      // Animate the ship
      const animateShip = () => {
        setShips(prev => prev.map(ship => {
          if (ship.id === newShip.id) {
            const newProgress = ship.progress + 0.005;
            if (newProgress >= 1) {
              return { ...ship, active: false };
            }
            return { ...ship, progress: newProgress };
          }
          return ship;
        }));
      };

      const interval = setInterval(animateShip, 50);
      
      // Clean up completed ships
      setTimeout(() => {
        clearInterval(interval);
        setShips(prev => prev.filter(ship => ship.id !== newShip.id));
      }, 20000);
    };

    if (shipsEnabled) {
      // Create a ship every 3 seconds
      shipIntervalRef.current = setInterval(createShipRoute, 3000);
      createShipRoute(); // Create first ship immediately
    } else {
      if (shipIntervalRef.current) {
        clearInterval(shipIntervalRef.current);
        shipIntervalRef.current = null;
      }
    }

    return () => {
      if (shipIntervalRef.current) {
        clearInterval(shipIntervalRef.current);
      }
    };
  }, [shipsEnabled]);

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

          {/* Ships */}
          {ships.filter(ship => ship.active).map((ship) => (
            <Ship3D
              key={ship.id}
              startPosition={[ship.startPlanet.x, ship.startPlanet.y, ship.startPlanet.z]}
              endPosition={[ship.endPlanet.x, ship.endPlanet.y, ship.endPlanet.z]}
              progress={ship.progress}
              onComplete={() => {
                setShips(prev => prev.filter(s => s.id !== ship.id));
              }}
            />
          ))}

          {/* Orbit controls for camera */}
          <OrbitControls
            ref={controlsRef}
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

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={() => setShipsEnabled(!shipsEnabled)}
          variant="outline"
          size="sm"
          className="bg-surface/80 backdrop-blur-sm"
        >
          {shipsEnabled ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {shipsEnabled ? "Stop Ships" : "Start Ships"}
        </Button>
        <Button
          onClick={resetView}
          variant="outline"
          size="sm"
          className="bg-surface/80 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset View
        </Button>
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