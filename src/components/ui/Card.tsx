import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean; // strip mint di tepi kiri
}

export default function Card({ children, className = "", accent = false }: CardProps) {
  return (
    <div
      className={`relative bg-surface border border-hairline rounded-card shadow-soft overflow-hidden ${className}`}
    >
      {accent && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-mint rounded-l-card" />
      )}
      <div className={accent ? "pl-5 pr-6 py-6" : "px-6 py-6"}>{children}</div>
    </div>
  );
}

