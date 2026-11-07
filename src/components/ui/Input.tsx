import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-surface border border-hairline rounded-input px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-colors ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-ink-secondary">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, className = "", id, ...props }: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={4}
        className={`bg-surface border border-hairline rounded-input px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-colors resize-none ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-ink-secondary">{hint}</p>}
    </div>
  );
}

