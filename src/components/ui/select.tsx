import * as React from "react";
type SelectRootProps = { value: string; onValueChange: (v: string) => void; children: React.ReactNode; };
const Ctx = React.createContext<{ value: string; onChange: (v: string) => void } | null>(null);
export function Select({ value, onValueChange, children }: SelectRootProps) {
  return <Ctx.Provider value={{ value, onChange: onValueChange }}>{children}</Ctx.Provider>;
}
export function SelectTrigger(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} />; }
export function SelectValue(props: React.HTMLAttributes<HTMLSpanElement>) { return <span {...props} />; }
export function SelectContent({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(Ctx); if (!ctx) return null;
  const options = React.Children.toArray(children).filter(Boolean) as any[];
  return (
    <select className={`w-full h-9 rounded-xl border border-slate-300 px-3 text-sm bg-white ${className}`}
      value={ctx.value} onChange={(e) => ctx.onChange(e.target.value)}>
      {options.map((opt: any, i: number) => opt.type?.displayName === "SelectItem" ? (
        <option key={i} value={opt.props.value}>{opt.props.children}</option>
      ) : null)}
    </select>
  );
}
type ItemProps = { value: string; children: React.ReactNode };
export function SelectItem(_props: ItemProps) { return null as any; }
SelectItem.displayName = "SelectItem";
