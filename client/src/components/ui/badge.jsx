import { cn } from "@/lib/utils";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-surfaceHover text-textSecondary",
    accent: "bg-accentSoft text-accent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-mono px-2.5 py-1 rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}