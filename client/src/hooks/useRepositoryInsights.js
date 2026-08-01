import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInsights, triggerAnalysis } from "../api/insightApi.js";
import { getSocket, disconnectSocket } from "../lib/socket.js";

export function useRepositoryInsights(repoId) {
  const queryClient = useQueryClient();
  const [liveState, setLiveState] = useState(null);
  const socketRef = useRef(null);

  const { data: insight, isLoading } = useQuery({
    queryKey: ["insights", repoId],
    queryFn: () => getInsights(repoId),
    enabled: Boolean(repoId),
    retry: false, // a 404 here just means "no analysis yet" — not worth retrying
  });

  const analyzeMutation = useMutation({
    mutationFn: () => triggerAnalysis(repoId),
    onSuccess: (data) => {
      setLiveState({ status: "analyzing", techStack: null, summary: null });
      queryClient.setQueryData(["insights", repoId], data);
    },
  });

  useEffect(() => {
    if (!repoId) return;

    const socket = getSocket();
    socketRef.current = socket;
    socket.connect();
    socket.emit("join:repo", repoId);

    function handleProgress({ step, status, data }) {
      setLiveState((prev) => ({
        ...(prev || {}),
        status: "analyzing",
        [`${step}Status`]: status,
        ...(step === "tech_stack" && status === "completed" ? { techStack: data } : {}),
        ...(step === "summary" && status === "completed" ? { summary: data.summary } : {}),
        ...(step === "architecture" && status === "completed"
          ? { architectureOverview: data.architecture_overview, modules: data.modules }
          : {}),
        ...(step === "api_routes" && status === "completed"
          ? { apiRoutes: data.apiRoutes }
          : {}),
          ...(step === "roadmap" && status === "completed"
          ? { learningRoadmap: data.learningRoadmap }
          : {}),
          ...(step === "health" && status === "completed"
          ? { healthMetrics: data.healthMetrics }
          : {}),
      }));
    }

    function handleCompleted() {
      setLiveState((prev) => ({ ...(prev || {}), status: "completed" }));
      queryClient.invalidateQueries({ queryKey: ["insights", repoId] });
    }

    function handleFailed({ message }) {
      setLiveState((prev) => ({ ...(prev || {}), status: "failed", error: message }));
    }

    socket.on("insight:progress", handleProgress);
    socket.on("insight:completed", handleCompleted);
    socket.on("insight:failed", handleFailed);

    return () => {
      socket.emit("leave:repo", repoId);
      socket.off("insight:progress", handleProgress);
      socket.off("insight:completed", handleCompleted);
      socket.off("insight:failed", handleFailed);
      disconnectSocket();
    };
  }, [repoId, queryClient]);

  const displayData = liveState || insight;

  return {
    insight: displayData,
    isLoading,
    analyze: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending || displayData?.status === "analyzing",
  };
}