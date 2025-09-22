import { useState } from "react";

interface Planet {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "earth" | "colonized" | "unexplored" | "hostile";
  owner?: string;
}

const planets: Planet[] = [
  { id: "earth", name: "Earth", x: 50, y: 60, type: "earth", owner: "player" },
  { id: "mars", name: "Mars", x: 75, y: 25, type: "colonized", owner: "player" },
  { id: "alpha", name: "Alpha Centauri", x: 20, y: 30, type: "unexplored" },
  { id: "beta", name: "Beta System", x: 80, y: 70, type: "hostile" },
  { id: "gamma", name: "Gamma Sector", x: 30, y: 80, type: "unexplored" },
];

export const GalaxyMap = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const getPlanetColor = (planet: Planet) => {
    switch (planet.type) {
      case "earth":
        return "bg-gradient-to-br from-blue-400 to-green-400";
      case "colonized":
        return "bg-primary";
      case "unexplored":
        return "bg-muted-foreground";
      case "hostile":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background via-surface to-background overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Draw connections between known planets */}
        <line
          x1="50%"
          y1="60%"
          x2="75%"
          y2="25%"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <line
          x1="50%"
          y1="60%"
          x2="20%"
          y2="30%"
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          strokeDasharray="3,7"
          opacity="0.5"
        />
      </svg>

      {/* Planets */}
      {planets.map((planet) => (
        <div
          key={planet.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: `${planet.x}%`, top: `${planet.y}%` }}
          onClick={() => setSelectedPlanet(planet)}
        >
          <div
            className={`planet-node ${getPlanetColor(planet)} ${
              selectedPlanet?.id === planet.id ? "scale-125 shadow-[0_0_20px_hsl(199_89%_48%_/_0.8)]" : ""
            }`}
          />
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-popover border border-border rounded-lg px-3 py-2 text-sm whitespace-nowrap">
              <div className="font-semibold text-foreground">{planet.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{planet.type}</div>
              {planet.owner && (
                <div className="text-xs text-primary">Controlled</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Selection info */}
      {selectedPlanet && (
        <div className="absolute bottom-4 left-4 game-panel p-4 min-w-64">
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
          </div>
        </div>
      )}
    </div>
  );
};