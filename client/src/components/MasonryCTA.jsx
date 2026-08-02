import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_ITEMS = [
  { label: "Chat streaming UI", height: "h-64" },
  { label: "Repository dashboard", height: "h-40" },
  { label: "Module explorer", height: "h-52" },
  { label: "API route list", height: "h-36" },
  { label: "Learning roadmap", height: "h-56" },
  { label: "Architecture overview", height: "h-44" },
  { label: "Tech stack detection", height: "h-40" },
  { label: "Health dashboard", height: "h-60" },
  { label: "Session sidebar", height: "h-48" },
];

function MasonryCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl mx-4 md:mx-auto max-w-6xl my-20">
      {/* Background masonry grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-3 p-3">
        {PLACEHOLDER_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`mb-3 break-inside-avoid rounded-xl border border-border bg-sidebar flex items-center justify-center overflow-hidden ${item.height}`}
          >
            <p className="font-mono text-[10px] text-textSecondary/70 text-center px-3">
              [ {item.label} ]
            </p>
          </motion.div>
        ))}
      </div>

      {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-textPrimary mb-3 max-w-lg">
          Understand your codebase in minutes, not days.
        </h2>
        <p className="text-textSecondary mb-6 max-w-md">
          Connect a repository and let AI generate the map, the roadmap, and the
          answers.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-lg bg-accent px-8 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
        >
          Connect a Repository
        </button>
      </div>
    </section>
  );
}

export default MasonryCTA;