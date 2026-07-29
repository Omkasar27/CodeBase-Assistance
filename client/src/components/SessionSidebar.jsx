import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import {
  useSessions,
  useCreateSession,
  useRenameSession,
  useDeleteSession,
} from "../hooks/useChatSessions.js";

function SessionSidebar({ repoId, activeSessionId }) {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useSessions(repoId);
  const createSession = useCreateSession(repoId);
  const renameSession = useRenameSession(repoId);
  const deleteSession = useDeleteSession(repoId);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  function handleCreate() {
    createSession.mutate(undefined, {
      onSuccess: (session) => {
        navigate(`/repos/${repoId}/chat/${session._id}`);
      },
    });
  }

  function startEditing(session) {
    setEditingId(session._id);
    setEditValue(session.title || "");
  }

  function confirmEdit(sessionId) {
    const trimmed = editValue.trim();
    if (trimmed) {
      renameSession.mutate({ sessionId, title: trimmed });
    }
    setEditingId(null);
  }

  function handleDelete(sessionId) {
    if (!confirm("Delete this conversation? This cannot be undone.")) return;

    deleteSession.mutate(sessionId, {
      onSuccess: () => {
        if (sessionId === activeSessionId) {
          navigate(`/repos/${repoId}/chat`);
        }
      },
    });
  }

  return (
    <aside className="w-64 border-r border-border flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <button
          onClick={handleCreate}
          disabled={createSession.isPending}
          className="w-full flex items-center gap-2 text-sm text-textPrimary bg-surface hover:bg-surfaceHover border border-border rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <p className="text-textSecondary text-xs text-center py-4">Loading...</p>
        )}

        {sessions && sessions.length === 0 && (
          <p className="text-textSecondary text-xs text-center py-4">
            No conversations yet.
          </p>
        )}

        {sessions?.map((session) => (
          <div
            key={session._id}
            className={`group flex items-center gap-1 rounded-lg mb-1 px-2 py-2 cursor-pointer transition-colors ${
              session._id === activeSessionId
                ? "bg-surfaceHover"
                : "hover:bg-surface"
            }`}
            onClick={() => {
              if (editingId !== session._id) {
                navigate(`/repos/${repoId}/chat/${session._id}`);
              }
            }}
          >
            {editingId === session._id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmEdit(session._id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 bg-background border border-accent rounded px-2 py-1 text-sm text-textPrimary outline-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmEdit(session._id);
                  }}
                  className="text-accent p-1"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(null);
                  }}
                  className="text-textSecondary p-1"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-textPrimary truncate">
                  {session.title || "New Conversation"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(session);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-textSecondary hover:text-textPrimary p-1 transition-opacity"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(session._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-textSecondary hover:text-red-400 p-1 transition-opacity"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SessionSidebar;