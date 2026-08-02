import { Link } from "react-router-dom";
import { Star, FolderGit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import {
  useDeleteRepository,
  useIndexRepository,
} from "../hooks/useRepositories.js";
import { useConfirm } from "../hooks/useConfirm.jsx";

function RepoListRow({ repository }) {
  const { confirm, ConfirmDialog } = useConfirm();
  const deleteRepo = useDeleteRepository();
  const indexRepo = useIndexRepository();

  const [menuOpen, setMenuOpen] = useState(false);

  const isCompleted = repository.indexingStatus === "completed";
  const isIndexing =
    indexRepo.isPending || repository.indexingStatus === "indexing";

  async function handleDelete() {
    setMenuOpen(false);

    const ok = await confirm(
      "Remove repository?",
      `"${repository.fullName}" and all its indexed data will be permanently removed. This cannot be undone.`
    );

    if (ok) {
      deleteRepo.mutate(repository._id);
    }
  }

  function handleIndex() {
    setMenuOpen(false);
    indexRepo.mutate(repository._id);
  }

  return (
    <>
      <div className="group relative flex w-full items-center gap-3 rounded px-3 py-2.5 transition-colors hover:bg-surfaceHover">
        <FolderGit2 size={16} className="shrink-0 text-textSecondary" />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-sm text-textPrimary">
              {repository.fullName}
            </span>

            <StatusBadge status={repository.indexingStatus} />
          </div>

          {repository.description && (
            <p className="mt-0.5 truncate text-xs text-textSecondary">
              {repository.description}
            </p>
          )}

          {repository.indexingStatus === "failed" &&
            repository.indexingError && (
              <p className="mt-0.5 truncate text-xs text-red-400">
                {repository.indexingError}
              </p>
            )}
        </div>

        <div className="flex shrink-0 items-center gap-3 text-xs text-textSecondary">
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

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!isCompleted && (
            <button
              onClick={handleIndex}
              disabled={isIndexing}
              className="rounded px-2 py-1 text-xs text-accent hover:bg-accentSoft disabled:opacity-50"
            >
              {isIndexing ? "Indexing..." : "Index"}
            </button>
          )}

          {isCompleted && (
            <Link
              to={`/repos/${repository._id}/chat`}
              className="rounded px-2 py-1 text-xs text-accent hover:bg-accentSoft"
            >
              Chat
            </Link>
          )}

          {isCompleted && (
            <Link
              to={`/repos/${repository._id}/insights`}
              className="rounded px-2 py-1 text-xs text-textSecondary hover:bg-surfaceHover"
            >
              Insights
            </Link>
          )}

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded p-1 text-textSecondary hover:bg-surfaceHover"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-3 top-10 z-10 min-w-[140px] rounded border border-border bg-sidebar py-1 shadow-lg">
              {isCompleted && (
                <button
                  onClick={handleIndex}
                  disabled={isIndexing}
                  className="w-full px-3 py-1.5 text-left text-sm text-textPrimary hover:bg-surfaceHover disabled:opacity-50"
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
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-400 hover:bg-surfaceHover"
              >
                <Trash2 size={13} />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* IMPORTANT: Mount the dialog */}
      {ConfirmDialog}
    </>
  );
}

export default RepoListRow;