import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "icon";
};

export function Button({ className = "", variant = "default", size = "md", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-2xl border transition px-4 py-2 text-sm";
  const variants = {
    default: "bg-black text-white border-black hover:opacity-90",
    outline: "bg-white text-black border-slate-300 hover:bg-slate-50",
  } as const;
  const sizes = {
    sm: "h-8 px-3 py-1.5",
    md: "h-9",
    icon: "h-9 w-9 p-0",
  } as const;

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
export default Button;
