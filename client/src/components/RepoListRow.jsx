import { Link } from "react-router-dom";
import { Star, FolderGit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import { useDeleteRepository, useIndexRepository } from "../hooks/useRepositories.js";

function RepoListRow({ repository }) {
  const deleteRepo = useDeleteRepository();
  const indexRepo = useIndexRepository();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompleted = repository.indexingStatus === "completed";
  const isIndexing = indexRepo.isPending || repository.indexingStatus === "indexing";

  function handleDelete() {
    setMenuOpen(false);
    if (confirm(`Remove "${repository.fullName}"? This cannot be undone.`)) {
      deleteRepo.mutate(repository._id);
    }
  }

  function handleIndex() {
    setMenuOpen(false);
    indexRepo.mutate(repository._id);
  }

  return (
    <div className="group flex items-center gap-3 px-3 py-2.5 rounded hover:bg-surfaceHover transition-colors relative w-full">
      <FolderGit2 size={16} className="text-textSecondary shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-sm text-textPrimary truncate">
            {repository.fullName}
          </span>
          <StatusBadge status={repository.indexingStatus} />
        </div>
        {repository.description && (
          <p className="text-xs text-textSecondary truncate mt-0.5">
            {repository.description}
          </p>
        )}
        {repository.indexingStatus === "failed" && repository.indexingError && (
          <p className="text-xs text-red-400 truncate mt-0.5">
            {repository.indexingError}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-textSecondary shrink-0">
        {repository.language && <span>{repository.language}</span>}
        <span className="flex items-center gap-1">
          <Star size={12} />
          {repository.stars}
        </span>
        {isCompleted && (
          <span>
            {repository.filesIndexed}f · {repository.chunksIndexed}c
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!isCompleted && (
          <button
            onClick={handleIndex}
            disabled={isIndexing}
            className="text-xs text-accent hover:bg-accentSoft rounded px-2 py-1 disabled:opacity-50"
          >
            {isIndexing ? "Indexing..." : "Index"}
          </button>
        )}

        {isCompleted && (
          <Link
            to={`/repos/${repository._id}/chat`}
            className="text-xs text-accent hover:bg-accentSoft rounded px-2 py-1"
          >
            Chat
          </Link>
        )}

        {isCompleted && (
          <Link
            to={`/repos/${repository._id}/insights`}
            className="text-xs text-textSecondary hover:bg-surfaceHover rounded px-2 py-1"
          >
            Insights
          </Link>
        )}

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="text-textSecondary hover:bg-surfaceHover rounded p-1"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-3 top-10 bg-sidebar border border-border rounded shadow-lg py-1 z-10 min-w-[140px]">
            {isCompleted && (
              <button
                onClick={handleIndex}
                disabled={isIndexing}
                className="w-full text-left px-3 py-1.5 text-sm text-textPrimary hover:bg-surfaceHover disabled:opacity-50"
              >
                {isIndexing ? "Indexing..." : "Re-index"}
              </button>
            )}
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-1.5 text-sm text-textPrimary hover:bg-surfaceHover"
            >
              View on GitHub
            </a>
            <button
              onClick={handleDelete}
              className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-surfaceHover"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RepoListRow;