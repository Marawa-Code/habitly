import { LucideIcon } from "lucide-react";

interface BadgeCardProps {
  name: string;
  description: string;
  Icon: LucideIcon;
  earned?: boolean;
}

export default function BadgeCard({ name, description, Icon, earned = false }: BadgeCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center w-20">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          earned ? "bg-mint-tint" : "bg-canvas border border-hairline"
        }`}
        title={earned ? "Lencana diperoleh" : "Lencana terkunci"}
      >
        <Icon
          size={26}
          strokeWidth={1.75}
          className={earned ? "text-action" : "text-ink-faint"}
        />
      </div>
      <span
        className={`text-xs font-semibold leading-tight ${
          earned ? "text-ink" : "text-ink-faint"
        }`}
      >
        {name}
      </span>
      {earned && (
        <span className="text-[10px] text-ink-secondary leading-tight">{description}</span>
      )}
    </div>
  );
}

