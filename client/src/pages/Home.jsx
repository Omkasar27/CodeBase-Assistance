import Aurora from "../components/aurora.jsx";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid.jsx";
import ArchitectureDiagram from "../components/ArchitectureDiagram.jsx";
import MasonryCTA from "../components/MasonryCTA.jsx";
import Footer from "../components/Footer.jsx";
import TechLogoMarquee from "../components/TechLogoMarquee";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import RotatingText from "../components/RotatingText.jsx";

import { AnimatedCounter } from "../components/AnimatedCounter.jsx";

import {
  MessageSquare,
  FolderTree,
  Boxes,
  Route,
  Map,
  Activity,
} from "lucide-react";



const FEATURES = [
  {
    title: "Chat With Your Codebase",
    description: "Ask natural-language questions and receive answers grounded in your repository.",
    className: "md:col-span-2 md:row-span-2",
    featured: true,
    icon: <MessageSquare size={16} className="text-accent" />,
    header: (
      <div className="rounded-lg border border-border bg-background p-4 font-mono text-sm">
        <div className="text-textSecondary">&gt; Where is JWT authentication implemented?</div>
        <div className="mt-4 rounded-md bg-sidebar p-3">
          <p className="text-accent">AI Assistant</p>
          <p className="mt-2 text-textPrimary">Authentication is handled in:</p>
          <ul className="mt-2 space-y-1 text-textSecondary">
            <li>📄 middleware/auth.js</li>
            <li>✓ verifyToken()</li>
            <li>✓ Used by routes/users.js</li>
          </ul>
        </div>
      </div>
    ),
    ghostIcon: <MessageSquare size={100} strokeWidth={1} />,
  },
  {
    title: "Repository Health",
    description: "High-level repository metrics in seconds.",
    className: "md:col-span-2",
    icon: <Activity size={16} className="text-accent" />,
    header: (
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="rounded-lg bg-background p-3">
          <div className="text-xl font-bold text-accent"><AnimatedCounter to={143} /></div>
          <div className="text-xs text-textSecondary">Files</div>
        </div>
        <div className="rounded-lg bg-background p-3">
          <div className="text-xl font-bold text-accent"><AnimatedCounter to={812} /></div>
          <div className="text-xs text-textSecondary">Functions</div>
        </div>
        <div className="rounded-lg bg-background p-3">
          <div className="text-xl font-bold text-accent"><AnimatedCounter to={14} /></div>
          <div className="text-xs text-textSecondary">TODOs</div>
        </div>
        <div className="rounded-lg bg-background p-3">
          <div className="text-xl font-bold text-green-400"><AnimatedCounter to={92} suffix="%" /></div>
          <div className="text-xs text-textSecondary">Health</div>
        </div>
      </div>
    ),
    ghostIcon: <Activity size={90} strokeWidth={1} />,
  },
  {
    title: "Tech Stack Detection",
    description: "Automatically detects languages and frameworks.",
    icon: <Boxes size={16} className="text-accent" />,
    header: (
      <div className="flex flex-wrap gap-2">
        {["React", "Node.js", "Express", "MongoDB", "Python"].map((item) => (
          <span key={item} className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
            {item}
          </span>
        ))}
      </div>
    ),
    ghostIcon: <Boxes size={80} strokeWidth={1} />,
  },
  {
    title: "Module Explorer",
    description: "Repository structure organized automatically.",
    icon: <FolderTree size={16} className="text-accent" />,
    header: (
      <div className="rounded-lg bg-background p-3 font-mono text-xs text-textSecondary">
        📁 src<br />├── components<br />├── services<br />└── routes
      </div>
    ),
    ghostIcon: <FolderTree size={80} strokeWidth={1} />,
  },
  {
    title: "API Explorer",
    description: "Every endpoint extracted from the repository.",
    className: "md:col-span-2",
    icon: <Route size={16} className="text-accent" />,
    header: (
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="rounded bg-background px-2 py-1.5 flex justify-between">
          <span className="text-green-400">GET</span><span>/repos</span>
        </div>
        <div className="rounded bg-background px-2 py-1.5 flex justify-between">
          <span className="text-blue-400">POST</span><span>/chat</span>
        </div>
        <div className="rounded bg-background px-2 py-1.5 flex justify-between">
          <span className="text-red-400">DEL</span><span>/repos</span>
        </div>
      </div>
    ),
    ghostIcon: <Route size={90} strokeWidth={1} />,
  },
  {
    title: "Learning Roadmap",
    description: "Step-by-step onboarding generated from the codebase.",
    icon: <Map size={16} className="text-accent" />,
    header: (
      <div className="space-y-1.5 text-xs text-textSecondary">
        <div>✓ Project Structure</div>
        <div>✓ Authentication</div>
        <div>✓ API Layer</div>
      </div>
    ),
    ghostIcon: <Map size={80} strokeWidth={1} />,
  },
];


function Home() {
  const navigate = useNavigate();

  const headline = "Understand Any GitHub Repository with AI";

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Aurora Background */}
       <div className="fixed inset-0 -z-10">
        <Aurora
          colorStops={["#1F3A5F", "#58A6FF", "#1F3A5F"]}
          amplitude={0.6}
          blend={0.3}
        />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      <div className="relative z-10">

        {/* ================= HERO ================= */}

        <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-5xl text-center text-4xl font-bold text-textPrimary md:text-6xl lg:text-7xl"
          >
            Understand Any{" "}
            <RotatingText
              texts={[
                "GitHub Repository",
                "Open Source Project",
                "Monorepo",
                "Codebase",
              ]}
              rotationInterval={2500}
              staggerDuration={0.03}
              splitBy="characters"
              mainClassName="inline-flex text-accent"
              elementLevelClassName="inline-block"
            />{" "}
            with AI
          </motion.h1>

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

        {/* ================= FEATURES ================= */}

        <section className="mx-auto max-w-7xl py-20">
          <h2 className="mb-2 text-center text-3xl font-semibold text-textPrimary">
            What Can It Do?
          </h2>

          <p className="mb-12 text-center text-textSecondary">
            One connected repository, six generated insights.
          </p>

          <BentoGrid>
          {FEATURES.map((feature, i) => (
            <BentoGridItem key={feature.title} index={i} {...feature} />
          ))}
        </BentoGrid>
        </section>


        {/* ================= ARCHITECTURE ================= */}

        <section className="mx-auto max-w-7xl py-24 text-center">

          <h2 className="text-4xl font-bold text-textPrimary">
            System Architecture
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-textSecondary">
            Every repository is processed through a multi-service pipeline that extracts
            structure, generates embeddings, and powers AI chat grounded in your codebase.
          </p>

          <div className="mt-16">
            <ArchitectureDiagram />
          </div>

        </section>




        {/* ================= BUILT WITH ================= */}

        <section className="py-12">
          <p className="mb-8 text-center text-xs uppercase tracking-widest text-textSecondary">
            Built With
          </p>

          <TechLogoMarquee />
        </section>

        <MasonryCTA />

        <Footer />
      </div>
    </main>
  );
}

export default Home;