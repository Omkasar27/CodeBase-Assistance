import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGithubTokenStatus,
  saveGithubToken,
  deleteGithubToken,
} from "../api/userApi.js";

export function useGithubTokenStatus() {
  return useQuery({
    queryKey: ["githubTokenStatus"],
    queryFn: getGithubTokenStatus,
  });
}

export function useSaveGithubToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveGithubToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["githubTokenStatus"] });
    },
  });
}

export function useDeleteGithubToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGithubToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["githubTokenStatus"] });
    },
  });
}