export function GlowOrb({ className = "", color = "#58A6FF", size = 200 }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
      }}
    />
  );
}