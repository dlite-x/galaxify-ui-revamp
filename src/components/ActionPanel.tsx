import { Rocket, FlaskConical, Building, Target, Clock } from "lucide-react";

interface ActionButton {
  id: string;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  disabled?: boolean;
}

const spaceActions: ActionButton[] = [
  { id: "launch", label: "Launch Pads", count: 4, icon: Rocket, color: "text-resource-credits" },
  { id: "missions", label: "Missions", count: 5, icon: Target, color: "text-destructive" },
  { id: "satellites", label: "Satellites", count: 2, icon: Building, color: "text-resource-crystal" },
  { id: "stations", label: "Space Stations", count: 0, icon: Building, color: "text-muted-foreground", disabled: true },
];

export const ActionPanel = () => {
  return (
    <div className="space-y-6">
      {/* Mission Control */}
      <div className="game-panel p-4">
        <button className="game-button-primary w-full mb-4">
          <Rocket className="w-4 h-4 mr-2" />
          Mission Control
        </button>
        
        <div className="game-panel p-3 bg-primary/10 border-primary/30">
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-foreground">M1: Build Orbital Station (Earth)</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">0/1</div>
        </div>
      </div>

      {/* Research & Development */}
      <div className="game-panel p-4">
        <div className="flex gap-2 mb-4">
          <button className="game-button-secondary flex-1">
            <FlaskConical className="w-4 h-4 mr-2" />
            Research
          </button>
          <button className="game-button-secondary flex-1">
            Trade & Invest
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Next Comet: 9:35</span>
        </div>
      </div>

      {/* Space Infrastructure */}
      <div className="game-panel p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Space</h3>
        <div className="grid grid-cols-2 gap-2">
          {spaceActions.map((action) => (
            <button
              key={action.id}
              className={`p-3 rounded-lg border border-border bg-surface/50 hover:bg-surface transition-all duration-200 text-left ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'
              }`}
              disabled={action.disabled}
            >
              <div className="flex items-center gap-2">
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{action.count}</div>
                  <div className="text-xs text-muted-foreground truncate">{action.label}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Special Buildings */}
      <div className="game-panel p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Special Buildings</h3>
        <div className="text-sm text-muted-foreground">
          No special buildings available
        </div>
      </div>
    </div>
  );
};