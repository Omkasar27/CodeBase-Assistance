import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSessions,
  createSession,
  renameSession,
  deleteSession,
} from "../api/chatApi.js";

export function useSessions(repoId) {
  return useQuery({
    queryKey: ["sessions", repoId],
    queryFn: () => getSessions(repoId),
    enabled: Boolean(repoId),
  });
}

export function useCreateSession(repoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createSession(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", repoId] });
    },
  });
}

export function useRenameSession(repoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, title }) => renameSession(sessionId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", repoId] });
    },
  });
}

export function useDeleteSession(repoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId) => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", repoId] });
    },
  });
}