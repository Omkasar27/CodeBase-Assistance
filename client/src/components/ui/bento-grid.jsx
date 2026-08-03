import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "./border-beam.jsx";
import { GlowOrb } from "./glow-orb.jsx";
import { DotPattern } from "./dot-pattern.jsx";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[14rem] md:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  ghostIcon,
  featured = false,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-sidebar p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        featured ? "hover:border-border" : "hover:border-accent/40",
        className
      )}
    >
      {featured && <BorderBeam size={80} duration={8} />}
      <DotPattern />
      <GlowOrb className="-top-10 -right-10" size={160} />

      {ghostIcon && (
        <div className="absolute -bottom-4 -right-4 text-border/60 pointer-events-none">
          {ghostIcon}
        </div>
      )}

      <div className="relative z-10">
        {header && <div className="mb-5 overflow-hidden rounded-xl">{header}</div>}

        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 shrink-0">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-textPrimary">{title}</h3>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-textSecondary">{description}</p>
      </div>
    </motion.div>
  );
};