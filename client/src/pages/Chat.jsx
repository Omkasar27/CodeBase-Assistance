import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useChatMessages } from "../hooks/useChatMessages.js";
import { useRepositories } from "../hooks/useRepositories.js";
import { streamQuestion, streamRegenerate } from "../api/chatApi.js";
import SessionSidebar from "../components/SessionSidebar.jsx";
import ChatMessageBubble from "../components/ChatMessageBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";

function Chat() {
  const { id: repoId, sessionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: repositories } = useRepositories();
  const repository = repositories?.find((r) => r._id === repoId);

  const { data: history, isLoading: historyLoading } = useChatMessages(sessionId);

  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages(history || []);
  }, [history, sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function updateLastMessage(updater) {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      updated[updated.length - 1] = updater(last);
      return updated;
    });
  }

  async function handleSend(question) {
    setStreamError("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question, sources: [] },
      { role: "assistant", content: "", sources: [] },
    ]);
    setIsStreaming(true);

    try {
      await streamQuestion(sessionId, question, {
        onSources: (sources) => updateLastMessage((m) => ({ ...m, sources })),
        onChunk: (content) =>
          updateLastMessage((m) => ({ ...m, content: m.content + content })),
        onError: (message) => setStreamError(message),
        onDone: () => {
          setIsStreaming(false);
          queryClient.invalidateQueries({ queryKey: ["chatMessages", sessionId] });
          queryClient.invalidateQueries({ queryKey: ["sessions", repoId] });
        },
      });
    } catch (err) {
      setStreamError(err.message || "Something went wrong.");
      setIsStreaming(false);
    }
  }

  async function handleRegenerate() {
    setStreamError("");
    setMessages((prev) => {
      const withoutLast = prev.slice(0, -1);
      return [...withoutLast, { role: "assistant", content: "", sources: [] }];
    });
    setIsStreaming(true);

    try {
      await streamRegenerate(sessionId, {
        onSources: (sources) => updateLastMessage((m) => ({ ...m, sources })),
        onChunk: (content) =>
          updateLastMessage((m) => ({ ...m, content: m.content + content })),
        onError: (message) => setStreamError(message),
        onDone: () => {
          setIsStreaming(false);
          queryClient.invalidateQueries({ queryKey: ["chatMessages", sessionId] });
        },
      });
    } catch (err) {
      setStreamError(err.message || "Something went wrong.");
      setIsStreaming(false);
    }
  }

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

  if (repository && repository.indexingStatus !== "completed") {
    return (
      <main className="px-6 py-10 text-center">
        <p className="text-textSecondary mb-3">
          This repository hasn't been indexed yet.
        </p>
        <Link to="/dashboard" className="text-accent hover:underline text-sm">
          Go index it from the Dashboard
        </Link>
      </main>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <SessionSidebar repoId={repoId} activeSessionId={sessionId} />

      <main className="flex-1 flex flex-col min-w-0">
        {!sessionId ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-textSecondary text-sm">
              Select a conversation, or start a new one.
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-border">
              <h1 className="font-mono text-textPrimary text-sm font-medium">
                {repository?.fullName}
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              {historyLoading && (
                <p className="text-textSecondary text-center text-sm">
                  Loading conversation...
                </p>
              )}

              {!historyLoading && messages.length === 0 && (
                <p className="text-textSecondary text-center text-sm py-10">
                  Ask anything about this codebase to get started.
                </p>
              )}

              {messages.map((msg, i) => (
                <ChatMessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                  isLast={i === messages.length - 1}
                  isStreaming={isStreaming}
                  onRegenerate={handleRegenerate}
                />
              ))}

              {streamError && (
                <p className="text-red-400 text-sm text-center mb-4">{streamError}</p>
              )}

              <div ref={scrollRef} />
            </div>

            <div className="px-6 py-4 border-t border-border">
              <ChatInput onSend={handleSend} disabled={isStreaming} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Chat;