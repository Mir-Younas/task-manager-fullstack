import { Layers3 } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md";
}

const Logo = ({ to = "/", variant = "dark", size = "md" }: LogoProps) => {
  const isLight = variant === "light";

  return (
    <Link
      to={to}
      aria-label="TaskFlow — Home"
      className="inline-flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl text-white ${
          size === "sm" ? "h-11 w-11" : "h-12 w-12"
        } ${isLight ? "bg-indigo-500" : "bg-indigo-600"}`}
      >
        <Layers3 size={size === "sm" ? 24 : 25} aria-hidden="true" />
      </span>

      <span
        className={`text-2xl font-bold tracking-tight ${
          isLight ? "text-white" : "text-slate-900"
        }`}
      >
        TaskFlow
      </span>
    </Link>
  );
};

export default Logo;
