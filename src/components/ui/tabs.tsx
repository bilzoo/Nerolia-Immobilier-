import * as React from "react";
type TabsProps = { value: string; onValueChange: (v: string) => void; children: React.ReactNode };
export function Tabs({ value, onValueChange, children }: TabsProps) {
  return <div data-value={value}>{React.Children.map(children as any, (c: any) => React.cloneElement(c, { __tabsValue: value, __onChange: onValueChange }))}</div>;
}
export function TabsList({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`inline-flex gap-2 rounded-xl bg-slate-100 p-1 ${className}`} {...props} />;
}
export function TabsTrigger({ value, children, __tabsValue, __onChange, ...props }: any) {
  const active = __tabsValue === value;
  return (
    <button className={`px-3 h-8 rounded-lg text-sm ${active ? "bg-white shadow border border-slate-200" : "opacity-70 hover:opacity-100"}`}
      onClick={() => __onChange(value)} {...props}>{children}</button>
  );
}
export function TabsContent({ value, children, __tabsValue, ...props }: any) {
  if (__tabsValue !== value) return null;
  return <div {...props}>{children}</div>;
}
