import * as React from "react";
type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" };
export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-xl px-2 py-0.5 text-xs";
  const variants = { default: "bg-slate-900 text-white", secondary: "bg-slate-100 text-slate-700" } as const;
  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
