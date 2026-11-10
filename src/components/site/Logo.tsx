import { Link } from "@tanstack/react-router";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center ${className ?? ""}`}>
      <img
        src="/kamtech-logo.png"
        alt="KamTech Solutions"
        className="h-12 w-auto transition-transform duration-200 group-hover:scale-[1.03] md:h-11"
      />
    </Link>
  );
}
