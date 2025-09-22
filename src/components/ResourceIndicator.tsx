import { Coins, Gem, Zap } from "lucide-react";

interface ResourceIndicatorProps {
  type: "credits" | "crystal" | "antimatter";
  value: number;
  change?: number;
}

export const ResourceIndicator = ({ type, value, change }: ResourceIndicatorProps) => {
  const getResourceConfig = () => {
    switch (type) {
      case "credits":
        return {
          icon: Coins,
          color: "text-resource-credits",
          bgColor: "shadow-resource-credits/30",
        };
      case "crystal":
        return {
          icon: Gem,
          color: "text-resource-crystal",
          bgColor: "shadow-resource-crystal/30",
        };
      case "antimatter":
        return {
          icon: Zap,
          color: "text-resource-antimatter",
          bgColor: "shadow-resource-antimatter/30",
        };
      default:
        return {
          icon: Coins,
          color: "text-resource-credits",
          bgColor: "shadow-resource-credits/30",
        };
    }
  };

  const { icon: Icon, color, bgColor } = getResourceConfig();

  return (
    <div className={`resource-indicator ${bgColor}`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-foreground">
          {value.toLocaleString()}
        </span>
        {change !== undefined && (
          <span className={`text-xs ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
            {change >= 0 ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
};