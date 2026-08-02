import LogoLoop from "./LogoLoop"; 

import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPython,
  SiFastapi,
  SiGithub,
} from "react-icons/si";

import { Database, BrainCircuit } from "lucide-react";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiExpress />, title: "Express", href: "https://expressjs.com" },
  { node: <SiMongodb />, title: "MongoDB", href: "https://mongodb.com" },
  { node: <SiPython />, title: "Python", href: "https://python.org" },
  { node: <SiFastapi />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { node: <Database />, title: "ChromaDB", href: "https://www.trychroma.com" },
  { node: <BrainCircuit />, title: "Groq", href: "https://groq.com" },
  { node: <SiGithub />, title: "GitHub API", href: "https://github.com" },
];

export default function TechLogoMarquee() {
  return (
    <div className="relative h-28 overflow-hidden">
      <LogoLoop
        logos={techLogos}
        speed={55}
        direction="left"
        logoHeight={36}
        gap={60}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
      />
    </div>
  );
}