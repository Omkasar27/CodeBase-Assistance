"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ title, description, data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-background font-sans" ref={containerRef}>
      {(title || description) && (
        <div className="max-w-4xl mx-auto py-10 px-4">
          {title && <h2 className="text-lg md:text-2xl mb-2 text-textPrimary font-semibold">{title}</h2>}
          {description && <p className="text-textSecondary text-sm md:text-base max-w-lg">{description}</p>}
        </div>
      )}

      <div ref={ref} className="relative max-w-4xl mx-auto pb-10">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-6">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-24 self-start max-w-[80px] md:w-full">
              <div className="h-8 absolute left-3 w-8 rounded-full bg-background flex items-center justify-center border border-border">
                <div className="h-3 w-3 rounded-full bg-accentSoft border border-accent" />
              </div>
              <h3 className="hidden md:block text-sm md:pl-14 font-semibold text-textSecondary">
                Step {item.order}
              </h3>
            </div>

            <div className="relative pl-16 pr-2 md:pl-4 w-full">
              <h3 className="md:hidden text-sm mb-1 font-semibold text-textSecondary">
                Step {item.order}
              </h3>
              <h4 className="text-base font-semibold text-textPrimary mb-1">{item.title}</h4>
              <p className="text-sm text-textSecondary mb-2">{item.description}</p>
              {item.relatedModules?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.relatedModules.map((mod) => (
                    <span
                      key={mod}
                      className="text-xs font-mono bg-surfaceHover px-2 py-0.5 rounded"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-7 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-accent via-accent/60 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};