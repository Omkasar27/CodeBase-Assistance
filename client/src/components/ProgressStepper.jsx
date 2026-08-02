const STEPS = [
  { key: "tech_stack", label: "Tech Stack" },
  { key: "summary", label: "Summary" },
  { key: "architecture", label: "Architecture" },
  { key: "api_routes", label: "API Routes" },
  { key: "roadmap", label: "Roadmap" },
  { key: "health", label: "Health" },
];

function statusFor(stepKey, insight) {
  const stepStatus = insight?.[`${stepKey}Status`];
  if (stepStatus === "completed") return "completed";
  if (stepStatus === "running") return "running";
  if (insight?.status === "completed") return "completed"; // fully done from DB, no live status recorded
  return "pending";
}

function ProgressStepper({ insight }) {
  if (!insight || insight.status === "pending") return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {STEPS.map((step) => {
        const status = statusFor(step.key, insight);
        return (
          <div
            key={step.key}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              status === "completed"
                ? "bg-accentSoft text-accent border-accent/30"
                : status === "running"
                ? "bg-surfaceHover text-textPrimary border-border animate-pulse"
                : "bg-background text-textSecondary border-border"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "completed"
                  ? "bg-accent"
                  : status === "running"
                  ? "bg-textSecondary"
                  : "bg-border"
              }`}
            />
            {step.label}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressStepper;