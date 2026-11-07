interface ProgressBarProps {
  value: number;   // 0-100
  label?: string;
  className?: string;
  ariaLabel?: string;
}

export default function ProgressBar({ value, label, className = "", ariaLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between text-xs text-ink-secondary font-medium">
          <span>{label}</span>
          <span aria-hidden="true">{clamped}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-sky-light-tint overflow-hidden">
        <div
          className="h-full rounded-full bg-sky transition-all duration-500"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel ?? label ?? "Progres"}
        />
      </div>
    </div>
  );
}

