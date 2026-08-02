import Aurora from "../components/aurora.jsx";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid.jsx";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards.jsx";
import ArchitectureDiagram from "../components/ArchitectureDiagram.jsx";
import MasonryCTA from "../components/MasonryCTA.jsx";
import Footer from "../components/Footer.jsx";

import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    title: "Chat With Your Codebase",
    description:
      "Ask natural-language questions and get streamed, source-cited answers grounded in the actual code — not generic guesses.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Tech Stack Detection",
    description:
      "Languages, frameworks, and package managers, parsed directly from manifest files.",
    className: "md:col-span-1",
  },
  {
    title: "Module Explorer",
    description:
      "Automatically detected folder structure with inferred purpose for each module.",
    className: "md:col-span-1",
  },
  {
    title: "API Explorer",
    description:
      "Routes extracted directly from source code — method, path, and verified auth requirements.",
    className: "md:col-span-1",
  },
  {
    title: "Learning Roadmap",
    description:
      "An ordered onboarding plan generated from the repo's own detected structure.",
    className: "md:col-span-1",
  },
  {
    title: "Repository Health",
    description:
      "Largest modules, complexity hotspots, config files, and TODO counts at a glance.",
    className: "md:col-span-1",
  },
];

const TECH_STACK = [
  { name: "React", description: "Frontend UI" },
  { name: "Node.js", description: "Backend runtime" },
  { name: "Express", description: "REST API framework" },
  { name: "MongoDB", description: "Primary database" },
  { name: "Python", description: "AI service runtime" },
  { name: "FastAPI", description: "AI service framework" },
  { name: "LangChain", description: "Chunking & retrieval" },
  { name: "ChromaDB", description: "Vector store" },
  { name: "Groq", description: "LLM inference" },
  { name: "GitHub API", description: "Repository data" },
];

function Home() {
  const navigate = useNavigate();

  const headline = "Understand Any GitHub Repository with AI";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10">
        <Aurora />
      </div>

      <div className="relative z-10">

        {/* ================= HERO ================= */}

        <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 py-16">

          <h1 className="mx-auto max-w-5xl text-center text-4xl font-bold text-textPrimary md:text-6xl lg:text-7xl">
            {headline.split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{
                  opacity: 0,
                  y: 10,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.08,
                }}
                className="mr-3 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 max-w-3xl text-center text-lg text-textSecondary md:text-xl"
          >
            Connect a repository and get an automatically generated
            architecture overview, API map, onboarding roadmap, and an AI chat
            that answers questions grounded directly in your source code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 flex flex-wrap justify-center gap-5"
          >
            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-accent px-8 py-3 font-medium text-white transition hover:-translate-y-1 hover:bg-accent/90"
            >
              Get Started
            </button>

            <a
              href="https://github.com/Omkasar27/CodeBase-Assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border bg-sidebar px-8 py-3 font-medium text-textPrimary transition hover:-translate-y-1 hover:bg-surfaceHover"
            >
              View on GitHub
            </a>
          </motion.div>  
        </section>

        {/* ================= BUILT WITH ================= */}

        <section className="mx-auto max-w-7xl py-12">
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-textSecondary">
            Built With
          </p>

          <InfiniteMovingCards
            items={TECH_STACK}
            direction="left"
            speed="normal"
          />
        </section>

        {/* ================= ARCHITECTURE ================= */}

        <section className="mx-auto max-w-7xl py-20 text-center">
          <h2 className="mb-3 text-3xl font-semibold text-textPrimary">
            Architecture
          </h2>

          <p className="mb-8 text-textSecondary">
            Three coordinated services, each with a single clear responsibility.
          </p>

          <ArchitectureDiagram />
        </section>

        {/* ================= FEATURES ================= */}

        <section className="mx-auto max-w-7xl py-20">
          <h2 className="mb-2 text-center text-3xl font-semibold text-textPrimary">
            What Can It Do?
          </h2>

          <p className="mb-12 text-center text-textSecondary">
            One connected repository, six generated insights.
          </p>

          <BentoGrid>
            {FEATURES.map((feature) => (
              <BentoGridItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                className={feature.className}
              />
            ))}
          </BentoGrid>
        </section>

        <MasonryCTA />

        <Footer />
      </div>
    </main>
  );
}

export default Home;