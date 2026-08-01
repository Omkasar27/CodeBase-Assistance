import HeroSectionOne from "../components/HeroSectionOne.jsx";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid.jsx";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards.jsx";
import ArchitectureDiagram from "../components/ArchitectureDiagram.jsx";

const FEATURES = [
  {
    title: "Chat With Your Codebase",
    description:
      "Ask natural-language questions and get streamed, source-cited answers grounded in the actual code — not generic guesses.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Tech Stack Detection",
    description: "Languages, frameworks, and package managers, parsed directly from manifest files.",
    className: "md:col-span-1",
  },
  {
    title: "Module Explorer",
    description: "Automatically detected folder structure with inferred purpose for each module.",
    className: "md:col-span-1",
  },
  {
    title: "API Explorer",
    description: "Routes extracted directly from source code — method, path, and verified auth requirements.",
    className: "md:col-span-1",
  },
  {
    title: "Learning Roadmap",
    description: "An ordered onboarding plan generated from the repo's own detected structure.",
    className: "md:col-span-1",
  },
  {
    title: "Repository Health",
    description: "Largest modules, complexity hotspots, config files, and TODO counts at a glance.",
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
  return (
    <main className="px-4">
      <HeroSectionOne />

      <section className="max-w-7xl mx-auto py-20">
        <h2 className="text-2xl font-semibold text-textPrimary text-center mb-2">
          What Can It Do?
        </h2>
        <p className="text-textSecondary text-center mb-10">
          One connected repository, six generated insights.
        </p>
        <section className="py-12">
          <p className="text-center text-xs uppercase tracking-widest text-textSecondary mb-6">
            Built With
          </p>
          <InfiniteMovingCards items={TECH_STACK} direction="left" speed="normal" />
        </section>

        <section className="max-w-7xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-semibold text-textPrimary mb-2">Architecture</h2>
          <p className="text-textSecondary mb-4">
            Three coordinated services, each with a single clear responsibility.
          </p>
          <ArchitectureDiagram />
        </section>

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

    </main>
  );
}

export default Home;