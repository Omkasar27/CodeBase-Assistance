"use client";

import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function HeroSectionOne() {
  const navigate = useNavigate();
  const headline = "Understand Any GitHub Repository with AI";

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-border/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-border/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-border/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>

      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-textPrimary md:text-4xl lg:text-6xl">
          {headline.split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: "easeInOut" }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-textSecondary"
        >
          Connect a repository and get an automatically generated architecture
          overview, API map, and onboarding roadmap — plus a chat that answers
          questions grounded in the actual source code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate("/register")}
            className="w-60 transform rounded-lg bg-accent px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
          >
            Get Started
          </button>
          <a
            href="https://github.com/Omkasar27/CodeBase-Assistance"
            target="_blank"
            rel="noopener noreferrer"
            className="w-60 transform rounded-lg border border-border bg-white px-6 py-2 text-center font-medium text-textPrimary transition-all duration-300 hover:-translate-y-0.5 hover:bg-sidebar"
          >
            View on GitHub
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.3 }}
          className="relative z-10 mt-16 rounded-3xl border border-border bg-sidebar p-4 shadow-md"
        >
          <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
            <p className="font-mono text-sm text-textSecondary px-8 text-center">
              [ Screenshot or screen recording of the chat / insights UI goes here ]
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}