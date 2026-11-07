import React from "react";

type Variant = "primary" | "secondary" | "disabled";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || variant === "disabled";

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 min-h-[48px] px-6 cursor-pointer";

  const variants: Record<Variant, string> = {
    primary: "bg-action text-white hover:bg-action-pressed active:bg-action-pressed",
    secondary: "bg-transparent text-action underline-offset-2 hover:underline",
    disabled: "bg-hairline text-ink-faint cursor-not-allowed",
  };

  const v = isDisabled ? "disabled" : variant;

  return (
    <button
      className={`${base} ${variants[v]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}

