import * as React from "react";
import { createPortal } from "react-dom";
type DialogRootProps = { open: boolean; onOpenChange?: (o: boolean) => void; children: React.ReactNode };
export function Dialog({ open, onOpenChange, children }: DialogRootProps) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange?.(false);
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onOpenChange]);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={() => onOpenChange?.(false)} />
      <div className="absolute inset-0 flex items-center justify-center p-4">{children}</div>
    </div>,
    document.body
  );
}
export function DialogContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white rounded-2xl shadow-xl w-full max-w-3xl ${className}`} {...props} />;
}
export function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) { return <div className="border-b p-4" {...props} />; }
export function DialogTitle(props: React.HTMLAttributes<HTMLDivElement>) { return <div className="text-lg font-semibold" {...props} />; }
