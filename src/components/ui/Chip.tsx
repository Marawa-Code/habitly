import React from "react";

interface ChipProps {
  children: React.ReactNode;
  variant?: "mint" | "sky" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export default function Chip({
  children,
  variant = "mint",
  icon,
  className = "",
}: ChipProps) {
  const variants = {
    mint: "bg-mint-tint text-action",
    sky: "bg-sky-light-tint text-info-text",
    neutral: "bg-canvas text-ink-secondary border border-hairline",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

