import { cn } from "@/lib/utils";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
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
}) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-sidebar p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl",
        className
      )}
    >
      <div className="mb-5 overflow-hidden rounded-xl">
        {header}
      </div>

      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-textPrimary">
          {title}
        </h3>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-textSecondary">
        {description}
      </p>
    </div>
  );
};