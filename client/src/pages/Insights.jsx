import { useParams, Link } from "react-router-dom";
import { useRepositoryInsights } from "../hooks/useRepositoryInsights.js";
import Button from "../components/Button.jsx";

function Insights() {
  const { id: repoId } = useParams();
  const { insight, isLoading, analyze, isAnalyzing } = useRepositoryInsights(repoId);

  return (
    <main className="px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="text-textSecondary text-sm hover:text-textPrimary">
          ← Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mt-4 mb-8">
          <h1 className="text-2xl font-semibold text-textPrimary">Repository Insights</h1>
          <div className="w-40">
            <Button onClick={analyze} isLoading={isAnalyzing} disabled={isAnalyzing}>
              {insight?.status === "completed" ? "Re-analyze" : "Analyze"}
            </Button>
          </div>
        </div>

        {isLoading && <p className="text-textSecondary text-sm">Loading...</p>}

        {!isLoading && !insight && (
          <div className="border border-dashed border-border rounded p-10 text-center">
            <p className="text-textSecondary text-sm">
              No analysis yet. Click "Analyze" to generate insights for this repository.
            </p>
          </div>
        )}

        {insight?.status === "failed" && (
          <p className="text-red-500 text-sm mb-4">
            Analysis failed: {insight.error}
          </p>
        )}

        {insight && (
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-medium text-textSecondary mb-2 uppercase tracking-wide">
                Tech Stack
              </h2>
              {insight.techStack?.languages?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {insight.techStack.languages.map((lang) => (
                    <span
                      key={lang}
                      className="text-xs font-mono bg-surfaceHover px-2.5 py-1 rounded"
                    >
                      {lang}
                    </span>
                  ))}
                  {insight.techStack.frameworks?.map((fw) => (
                    <span
                      key={fw}
                      className="text-xs font-mono bg-accentSoft text-accent px-2.5 py-1 rounded"
                    >
                      {fw}
                    </span>
                  ))}
                  {insight.techStack.packageManagers?.map((pm) => (
                    <span
                      key={pm}
                      className="text-xs font-mono bg-surfaceHover px-2.5 py-1 rounded"
                    >
                      {pm}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-textSecondary text-sm">
                  {isAnalyzing ? "Detecting..." : "Not yet detected."}
                </p>
              )}
            </section>

            <section>
              <h2 className="text-sm font-medium text-textSecondary mb-2 uppercase tracking-wide">
                Summary
              </h2>
              {insight.summary ? (
                <p className="text-sm text-textPrimary leading-relaxed whitespace-pre-wrap">
                  {insight.summary}
                </p>
              ) : (
                <p className="text-textSecondary text-sm">
                  {isAnalyzing ? "Generating summary..." : "Not yet generated."}
                </p>
              )}
            </section>
            <section>
              <h2 className="text-sm font-medium text-textSecondary mb-2 uppercase tracking-wide">
                Architecture Overview
              </h2>
              {insight.architectureOverview ? (
                <p className="text-sm text-textPrimary leading-relaxed">
                  {insight.architectureOverview}
                </p>
              ) : (
                <p className="text-textSecondary text-sm">
                  {isAnalyzing ? "Analyzing structure..." : "Not yet generated."}
                </p>
              )}
            </section>

            {insight.modules && insight.modules.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-2 uppercase tracking-wide">
                  Modules
                </h2>
                <p className="text-xs text-textSecondary mb-3">
                  Inferred from folder structure and file names — not a read of file contents.
                </p>
                <div className="border border-border rounded divide-y divide-border">
                  {insight.modules.map((mod) => (
                    <div key={mod.path} className="p-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-sm text-textPrimary">{mod.name}</span>
                        <span className="text-xs text-textSecondary">{mod.path}</span>
                      </div>
                      {mod.purpose && (
                        <p className="text-sm text-textSecondary mt-1">{mod.purpose}</p>
                      )}
                      {mod.importantFiles?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {mod.importantFiles.map((f) => (
                            <span
                              key={f}
                              className="text-xs font-mono bg-surfaceHover px-2 py-0.5 rounded"
                            >
                              {f.split("/").pop()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {insight.apiRoutes && insight.apiRoutes.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-2 uppercase tracking-wide">
                  API Routes
                </h2>
                <div className="border border-border rounded overflow-hidden">
                  {insight.apiRoutes.map((route, i) => (
                    <div
                      key={`${route.method}-${route.path}-${i}`}
                      className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0"
                    >
                      <span
                        className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded w-14 text-center shrink-0 ${
                          route.method === "GET"
                            ? "bg-accentSoft text-accent"
                            : "bg-surfaceHover text-textSecondary"
                        }`}
                      >
                        {route.method}
                      </span>
                      <span className="font-mono text-sm text-textPrimary shrink-0">
                        {route.path}
                      </span>
                      {route.authRequired && (
                        <span className="text-xs bg-surfaceHover px-1.5 py-0.5 rounded text-textSecondary shrink-0">
                          🔒 Auth
                        </span>
                      )}
                      <span className="text-xs text-textSecondary truncate ml-auto">
                        {route.description}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {insight.learningRoadmap && insight.learningRoadmap.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-2 uppercase tracking-wide">
                  Learning Roadmap
                </h2>
                <ol className="space-y-3">
                  {insight.learningRoadmap
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <li key={step.order} className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-accentSoft text-accent text-xs font-semibold flex items-center justify-center mt-0.5">
                          {step.order}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-textPrimary">
                            {step.title}
                          </p>
                          <p className="text-sm text-textSecondary mt-0.5">
                            {step.description}
                          </p>
                          {step.relatedModules?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {step.relatedModules.map((mod) => (
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
                      </li>
                    ))}
                </ol>
              </section>
            )}
            {insight.healthMetrics && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-2 uppercase tracking-wide">
                  Repository Health
                </h2>
                <p className="text-xs text-textSecondary mb-3">
                  TODO count is based only on files already scanned during analysis, not a full repository scan.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="border border-border rounded p-3">
                    <p className="text-2xl font-semibold text-textPrimary">
                      {insight.healthMetrics.todoCount}
                    </p>
                    <p className="text-xs text-textSecondary">TODO / FIXME comments</p>
                  </div>
                  <div className="border border-border rounded p-3">
                    <p className="text-2xl font-semibold text-textPrimary">
                      {insight.healthMetrics.hasReadme ? "Yes" : "No"}
                    </p>
                    <p className="text-xs text-textSecondary">README present</p>
                  </div>
                </div>

                {insight.healthMetrics.configFiles?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-textSecondary mb-1.5">Configuration Files</p>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.healthMetrics.configFiles.map((f) => (
                        <span
                          key={f}
                          className="text-xs font-mono bg-surfaceHover px-2 py-0.5 rounded"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {insight.healthMetrics.largestModules?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-textSecondary mb-1.5">Largest Modules</p>
                    <div className="space-y-1">
                      {insight.healthMetrics.largestModules.map((m) => (
                        <div key={m.path} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-textPrimary">{m.path}</span>
                          <span className="text-textSecondary">{m.fileCount} files</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {insight.healthMetrics.complexityHotspots?.length > 0 && (
                  <div>
                    <p className="text-xs text-textSecondary mb-1.5">Potential Complexity Hotspots</p>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.healthMetrics.complexityHotspots.map((m) => (
                        <span
                          key={m.path}
                          className="text-xs font-mono bg-red-50 text-red-600 px-2 py-0.5 rounded"
                        >
                          {m.path} ({m.fileCount})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Insights;