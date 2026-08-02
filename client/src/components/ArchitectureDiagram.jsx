import { useRef } from "react";
import { AnimatedBeam } from "./ui/animated-beam.jsx";

import {
  SiReact,
  SiGithub,
  SiNodedotjs,
  SiPython,
  SiMongodb,
} from "react-icons/si";

import { FaDatabase, FaRobot } from "react-icons/fa";

function Node({ innerRef, label }) {
  return (
    <div
      ref={innerRef}
      className="z-10 flex h-16 w-32 items-center justify-center rounded-xl border border-border bg-sidebar px-2 text-center text-xs font-medium text-textPrimary shadow-sm"
    >
      {label}
    </div>
  );
}

function ArchitectureDiagram() {
  const containerRef = useRef(null);

  const githubRef = useRef(null);
  const clientRef = useRef(null);
  const nodeRef = useRef(null);
  const pythonRef = useRef(null);
  const mongoRef = useRef(null);
  const chromaRef = useRef(null);
  const groqRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto grid max-w-3xl grid-cols-3 items-center gap-8 py-16"
    >
      {/* Left Column */}
      <div className="flex flex-col items-center gap-10">
        <Node
          innerRef={clientRef}
          icon={<SiReact className="text-5xl text-cyan-500" />}
        />

        <Node
          innerRef={githubRef}
          icon={<SiGithub className="text-5xl text-black" />}
        />
      </div>

      {/* Middle Column */}
      <div className="flex flex-col items-center gap-10">
        <Node
          innerRef={nodeRef}
          icon={<SiNodedotjs className="text-5xl text-green-600" />}
        />

        <Node
          innerRef={pythonRef}
          icon={<SiPython className="text-5xl text-blue-500" />}
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col items-center gap-10">
        <Node
          innerRef={mongoRef}
          icon={<SiMongodb className="text-5xl text-green-700" />}
        />

        <Node
          innerRef={chromaRef}
          icon={<FaDatabase className="text-5xl text-purple-600" />}
        />

        <Node
          innerRef={groqRef}
          icon={<FaRobot className="text-5xl text-orange-500" />}
        />
      </div>

      {/* Animated Connections */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clientRef}
        toRef={nodeRef}
        curvature={30}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={githubRef}
        toRef={nodeRef}
        curvature={-30}
        reverse
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeRef}
        toRef={pythonRef}
        curvature={0}
        delay={0.5}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeRef}
        toRef={mongoRef}
        curvature={30}
        delay={1}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pythonRef}
        toRef={chromaRef}
        curvature={-20}
        delay={1.5}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pythonRef}
        toRef={groqRef}
        curvature={20}
        delay={2}
      />
    </div>
  );
}

export default ArchitectureDiagram;