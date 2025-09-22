import { Clock, Rocket, Bell } from "lucide-react";
import { ResourceIndicator } from "./ResourceIndicator";

export const GameHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/80 backdrop-blur-sm">
      {/* Left side - Game info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary-glow">Expanse</h1>
          <span className="text-sm text-muted-foreground">v0.1</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-primary">Terran Corp</span>
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <span className="text-muted-foreground">NASA</span>
          <span className="text-foreground">Level 1</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-accent font-mono">0:24</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full">
          <Rocket className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary">2 missions in transit</span>
        </div>
      </div>

      {/* Right side - Resources */}
      <div className="flex items-center gap-4">
        <ResourceIndicator type="credits" value={5002} />
        <ResourceIndicator type="crystal" value={0} />
        <ResourceIndicator type="antimatter" value={1} />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Score</span>
          <span className="text-success font-bold">0</span>
        </div>
        <button className="p-2 hover:bg-surface rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-warning" />
        </button>
      </div>
    </header>
  );
};