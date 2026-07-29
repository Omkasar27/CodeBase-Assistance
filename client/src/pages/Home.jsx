function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="font-mono text-sm text-accent tracking-widest uppercase mb-4">
          AI Codebase Assistant
        </p>
        <h1 className="text-4xl font-semibold text-textPrimary mb-4">
          Ask your codebase anything.
        </h1>
        <p className="text-textSecondary text-base leading-relaxed">
          Connect a GitHub repository and get grounded, natural-language
          answers about how the code actually works.
        </p>
      </div>
    </main>
  );
}

export default Home;