import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/kamtech-logo.png.asset.json";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center ${className ?? ""}`}>
      <img
        src={logoAsset.url}
        alt="KamTech Solutions"
        className="h-10 w-auto transition-transform duration-200 group-hover:scale-[1.03] md:h-9"
      />
    </Link>
  );
}
