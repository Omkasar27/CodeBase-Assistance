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

function Node({ innerRef, icon, label }) {
  return (
    <div
      ref={innerRef}
      className="z-10 flex h-24 w-40 flex-col items-center justify-center rounded-2xl border border-border bg-sidebar shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl"
    >
      <div className="mb-2 text-4xl">{icon}</div>

      <p className="text-sm font-semibold text-textPrimary">
        {label}
      </p>
    </div>
  );
}

export default function ArchitectureDiagram() {
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
      className="relative mx-auto grid max-w-5xl grid-cols-3 items-center gap-12 py-16"
    >
      {/* Left */}
      <div className="flex flex-col items-center gap-12">
        <Node
          innerRef={clientRef}
          icon={<SiReact className="text-cyan-400" />}
          label="React Frontend"
        />

        <Node
          innerRef={githubRef}
          icon={<SiGithub className="text-white" />}
          label="GitHub Repository"
        />
      </div>

      {/* Center */}
      <div className="flex flex-col items-center gap-12">
        <Node
          innerRef={nodeRef}
          icon={<SiNodedotjs className="text-green-500" />}
          label="Node.js API"
        />

        <Node
          innerRef={pythonRef}
          icon={<SiPython className="text-blue-400" />}
          label="Python AI"
        />
      </div>

      {/* Right */}
      <div className="flex flex-col items-center gap-12">
        <Node
          innerRef={mongoRef}
          icon={<SiMongodb className="text-green-600" />}
          label="MongoDB"
        />

        <Node
          innerRef={chromaRef}
          icon={<FaDatabase className="text-purple-500" />}
          label="ChromaDB"
        />

        <Node
          innerRef={groqRef}
          icon={<FaRobot className="text-orange-400" />}
          label="Groq LLM"
        />
      </div>

      {/* Animated Connections */}

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={githubRef}
        toRef={nodeRef}
        curvature={-35}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clientRef}
        toRef={nodeRef}
        curvature={35}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeRef}
        toRef={pythonRef}
        curvature={0}
        delay={0.4}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={nodeRef}
        toRef={mongoRef}
        curvature={25}
        delay={0.8}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pythonRef}
        toRef={chromaRef}
        curvature={-25}
        delay={1.2}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pythonRef}
        toRef={groqRef}
        curvature={25}
        delay={1.6}
      />
    </div>
  );
}