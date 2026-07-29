import { useQuery } from "@tanstack/react-query";
import { getChatHistory } from "../api/chatApi.js";

export function useChatMessages(sessionId) {
  return useQuery({
    queryKey: ["chatMessages", sessionId],
    queryFn: () => getChatHistory(sessionId),
    enabled: Boolean(sessionId),
  });
}