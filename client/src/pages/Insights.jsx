import { useParams, Link } from "react-router-dom";
import { useRepositoryInsights } from "../hooks/useRepositoryInsights.js";
import { useRepositories } from "../hooks/useRepositories.js";
import Button from "../components/Button.jsx";
import ProgressStepper from "../components/ProgressStepper.jsx";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid.jsx";
import { CardSpotlight } from "../components/ui/card-spotlight.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { AccordionItem } from "../components/ui/accordion.jsx";
import { Timeline } from "../components/ui/timeline.jsx";
import ArchitectureDiagram from "../components/ArchitectureDiagram.jsx";
import { CheckCircle2, Circle } from "lucide-react";

function Insights() {
  const { id: repoId } = useParams();
  const { data: repositories } = useRepositories();
  const repository = repositories?.find((r) => r._id === repoId);
  const { insight, isLoading, analyze, isAnalyzing } = useRepositoryInsights(repoId);

  if (repositories && !repository) {
    return (
      <main className="px-6 py-10 text-center">
        <p className="text-textSecondary">Repository not found.</p>
        <Link to="/dashboard" className="text-accent hover:underline text-sm">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs text-textSecondary mb-1">
          <Link to="/dashboard" className="hover:text-textPrimary">Dashboard</Link>
          <span>/</span>
          <span className="text-textPrimary">{repository?.fullName}</span>
          <span>/</span>
          <span>Insights</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-textPrimary font-mono">
            {repository?.fullName}
          </h1>
          <div className="w-36">
            <Button onClick={analyze} isLoading={isAnalyzing} disabled={isAnalyzing}>
              {insight?.status === "completed" ? "Re-analyze" : "Analyze"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <ProgressStepper insight={insight} />

        {isLoading && <p className="text-textSecondary text-sm">Loading...</p>}

        {!isLoading && !insight && (
          <div className="border border-dashed border-border rounded-xl p-10 text-center">
            <p className="text-textSecondary text-sm">
              No analysis yet. Click "Analyze" to generate insights for this repository.
            </p>
          </div>
        )}

        {insight?.status === "failed" && (
          <p className="text-red-500 text-sm mb-6">Analysis failed: {insight.error}</p>
        )}

        {insight && (
          <div className="space-y-10">
            {/* Stats — Bento Grid */}
            <section>
              <BentoGrid className="md:auto-rows-[8rem]">
                <BentoGridItem
                  title="Languages"
                  description={insight.techStack?.languages?.join(", ") || "—"}
                  className="md:col-span-1"
                />
                <BentoGridItem
                  title="Modules Detected"
                  description={`${insight.modules?.length || 0} modules`}
                  className="md:col-span-1"
                />
                <BentoGridItem
                  title="API Routes"
                  description={`${insight.apiRoutes?.length || 0} endpoints`}
                  className="md:col-span-1"
                />
              </BentoGrid>
            </section>

            {/* AI Summary — Card Spotlight */}
            {insight.summary && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-3 uppercase tracking-wide">
                  Summary
                </h2>
                <CardSpotlight>
                  <p className="text-sm text-textPrimary leading-relaxed">{insight.summary}</p>
                </CardSpotlight>
              </section>
            )}

            {/* Tech Stack — Badges */}
            {insight.techStack?.languages?.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-3 uppercase tracking-wide">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {insight.techStack.languages.map((l) => (
                    <Badge key={l}>{l}</Badge>
                  ))}
                  {insight.techStack.frameworks?.map((f) => (
                    <Badge key={f} variant="accent">{f}</Badge>
                  ))}
                  {insight.techStack.packageManagers?.map((p) => (
                    <Badge key={p}>{p}</Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Architecture — Animated Beam */}
            {insight.architectureOverview && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-3 uppercase tracking-wide">
                  Architecture
                </h2>
                <p className="text-sm text-textPrimary leading-relaxed mb-4">
                  {insight.architectureOverview}
                </p>
                <ArchitectureDiagram />
              </section>
            )}

            {/* Modules — Accordion */}
            {insight.modules?.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-1 uppercase tracking-wide">
                  Modules
                </h2>
                <p className="text-xs text-textSecondary mb-3">
                  Inferred from folder structure and file names — not a read of file contents.
                </p>
                <div className="space-y-2">
                  {insight.modules.map((mod) => (
                    <AccordionItem key={mod.path} title={mod.name} subtitle={mod.path}>
                      {mod.purpose && (
                        <p className="text-sm text-textSecondary mb-2">{mod.purpose}</p>
                      )}
                      {mod.importantFiles?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {mod.importantFiles.map((f) => (
                            <Badge key={f}>{f.split("/").pop()}</Badge>
                          ))}
                        </div>
                      )}
                    </AccordionItem>
                  ))}
                </div>
              </section>
            )}

            {/* API Routes — Data table */}
            {insight.apiRoutes?.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-3 uppercase tracking-wide">
                  API Routes
                </h2>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-sidebar">
                      <tr>
                        <th className="text-left font-medium text-textSecondary px-3 py-2 w-20">Method</th>
                        <th className="text-left font-medium text-textSecondary px-3 py-2">Path</th>
                        <th className="text-left font-medium text-textSecondary px-3 py-2 w-16">Auth</th>
                        <th className="text-left font-medium text-textSecondary px-3 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {insight.apiRoutes.map((route, i) => (
                        <tr key={`${route.method}-${route.path}-${i}`} className="hover:bg-surfaceHover">
                          <td className="px-3 py-2">
                            <Badge variant={route.method === "GET" ? "accent" : "default"}>
                              {route.method}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 font-mono text-textPrimary">{route.path}</td>
                          <td className="px-3 py-2">{route.authRequired ? "🔒" : ""}</td>
                          <td className="px-3 py-2 text-textSecondary truncate max-w-[200px]">
                            {route.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Learning Roadmap — Timeline */}
            {insight.learningRoadmap?.length > 0 && (
              <section>
                <Timeline
                  title="Learning Roadmap"
                  description="A suggested order for exploring this codebase."
                  data={insight.learningRoadmap.slice().sort((a, b) => a.order - b.order)}
                />
              </section>
            )}

            {/* Repository Health — Checklist */}
            {insight.healthMetrics && (
              <section>
                <h2 className="text-sm font-medium text-textSecondary mb-1 uppercase tracking-wide">
                  Repository Health
                </h2>
                <p className="text-xs text-textSecondary mb-3">
                  Based only on files already scanned during analysis, not a full repository scan.
                </p>
                <div className="border border-border rounded-lg divide-y divide-border">
                  <div className="flex items-center gap-2 px-4 py-3">
                    {insight.healthMetrics.hasReadme ? (
                      <CheckCircle2 size={16} className="text-accent shrink-0" />
                    ) : (
                      <Circle size={16} className="text-textSecondary shrink-0" />
                    )}
                    <span className="text-sm text-textPrimary">README present</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3">
                    <CheckCircle2 size={16} className="text-accent shrink-0" />
                    <span className="text-sm text-textPrimary">
                      {insight.healthMetrics.todoCount} TODO / FIXME comments found
                    </span>
                  </div>
                  {insight.healthMetrics.configFiles?.length > 0 && (
                    <div className="px-4 py-3">
                      <p className="text-sm text-textPrimary mb-2">Configuration files detected</p>
                      <div className="flex flex-wrap gap-1.5">
                        {insight.healthMetrics.configFiles.map((f) => (
                          <Badge key={f}>{f}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {insight.healthMetrics.complexityHotspots?.length > 0 && (
                    <div className="px-4 py-3">
                      <p className="text-sm text-textPrimary mb-2">Potential complexity hotspots</p>
                      <div className="flex flex-wrap gap-1.5">
                        {insight.healthMetrics.complexityHotspots.map((m) => (
                          <Badge key={m.path} variant="accent">
                            {m.path} ({m.fileCount})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Insights;