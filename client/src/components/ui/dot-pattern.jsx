export function DotPattern({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, #30363D 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        maskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 90%)",
      }}
    />
  );
}