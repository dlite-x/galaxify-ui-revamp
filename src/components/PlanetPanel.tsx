import { Globe, Users, Thermometer, Wind } from "lucide-react";
import { ResourceIndicator } from "./ResourceIndicator";

interface PlanetStats {
  population: string;
  income: string;
  co2: string;
  temperature: string;
}

interface Resource {
  type: string;
  amount: number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

const planetStats: PlanetStats = {
  population: "8.0B",
  income: "+11,500 Cr/hr",
  co2: "420.0 ppm",
  temperature: "15.0°C",
};

const resources: Resource[] = [
  { type: "Water", amount: 1000, change: 240, icon: Globe },
  { type: "Oxygen", amount: 4, change: 0, icon: Wind },
  { type: "Fuel", amount: 200, change: 0, icon: Globe },
  { type: "Food", amount: 1, change: 60, icon: Globe },
  { type: "Compute", amount: 1, change: 0, icon: Globe },
  { type: "Power", amount: 1, change: 0, icon: Globe },
  { type: "Factories", amount: 5, change: 0, icon: Globe },
  { type: "Metal", amount: 1, change: 0, icon: Globe },
];

export const PlanetPanel = () => {
  return (
    <div className="space-y-6">
      {/* Planet header */}
      <div className="game-panel p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-green-400 border-2 border-primary shadow-[0_0_10px_hsl(199_89%_48%_/_0.6)]" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Earth</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">Colonized</span>
              <span className="text-sm text-muted-foreground">1g</span>
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded border border-primary/40">
                Home World
              </span>
            </div>
          </div>
        </div>

        {/* Planet stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="text-muted-foreground">Population:</div>
              <div className="text-foreground font-semibold">{planetStats.population}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <div className="text-muted-foreground">Income:</div>
              <div className="text-success font-semibold">{planetStats.income}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-warning" />
            <div>
              <div className="text-muted-foreground">CO₂:</div>
              <div className="text-warning font-semibold">{planetStats.co2}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            <div>
              <div className="text-muted-foreground">Temp:</div>
              <div className="text-primary font-semibold">{planetStats.temperature}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="game-panel p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
        <div className="grid grid-cols-2 gap-3">
          {resources.map((resource) => (
            <div key={resource.type} className="resource-indicator">
              <resource.icon className="w-4 h-4 text-primary" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">
                    {resource.amount.toLocaleString()}
                  </span>
                  {resource.change !== 0 && (
                    <span className={`text-xs ${resource.change > 0 ? 'text-success' : 'text-destructive'}`}>
                      {resource.change > 0 ? '+' : ''}{resource.change}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{resource.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};