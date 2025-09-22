import { GameHeader } from "./GameHeader";
import { GalaxyMap } from "./GalaxyMap";
import { PlanetPanel } from "./PlanetPanel";
import { ActionPanel } from "./ActionPanel";

export const GameInterface = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GameHeader />
      
      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Planet Info */}
        <aside className="w-80 p-4 border-r border-border bg-surface/30 overflow-y-auto">
          <PlanetPanel />
        </aside>

        {/* Center - Galaxy Map */}
        <section className="flex-1 relative">
          <GalaxyMap />
        </section>

        {/* Right Sidebar - Actions */}
        <aside className="w-80 p-4 border-l border-border bg-surface/30 overflow-y-auto">
          <ActionPanel />
        </aside>
      </main>
    </div>
  );
};