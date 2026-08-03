import { useEffect, useRef } from "react";
import { motion, useMotionValue, useInView, animate } from "motion/react";

export function AnimatedCounter({ to, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 1.2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, to, count]);

  return (
    <motion.span ref={ref}>
      <motion.span>{useMotionValueText(count)}</motion.span>
      {suffix}
    </motion.span>
  );
}

function useMotionValueText(value) {
  const ref = useRef(null);
  useEffect(() => {
    return value.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toString();
    });
  }, [value]);
  return <span ref={ref}>0</span>;
}