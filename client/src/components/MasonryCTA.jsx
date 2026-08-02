import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_ITEMS = [
  { image: "/masonry/Github1.jpg", height: "h-64" },
  { image: "/masonry/Github2.png", height: "h-40" },
  { image: "/masonry/Github3.png", height: "h-52" },
  { image: "/masonry/Github4.png", height: "h-48" },

  { image: "/masonry/Github1.jpg", height: "h-56" },
  { image: "/masonry/Github2.png", height: "h-36" },
  { image: "/masonry/Github3.png", height: "h-60" },
  { image: "/masonry/Github4.png", height: "h-44" },
];

function MasonryCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl mx-4 md:mx-auto max-w-6xl my-20">
      {/* Background masonry grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-3 p-3">
        {PLACEHOLDER_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`mb-3 break-inside-avoid overflow-hidden rounded-xl border border-border ${item.height}`}
          >
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 hover:scale-105 brightness-75 hover:brightness-100"
            />
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