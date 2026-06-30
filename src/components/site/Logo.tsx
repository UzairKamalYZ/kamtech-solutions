import { Link } from "@tanstack/react-router";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className ?? ""}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-elegant">
        <span className="font-display text-sm font-bold tracking-tight">K</span>
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary/40 transition-transform group-hover:scale-125" />
      </span>
      <span className="font-display text-base font-semibold tracking-tight text-foreground">
        KamTech<span className="text-primary">.</span>
      </span>
    </Link>
  );
}
