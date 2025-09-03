import * as React from "react";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-9 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200 ${props.className || ""}`}
    />
  );
}
