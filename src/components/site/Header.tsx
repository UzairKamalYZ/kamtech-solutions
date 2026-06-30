import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { nav } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground bg-surface" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          Start a project
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-foreground bg-surface" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
            >
              Start a project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
