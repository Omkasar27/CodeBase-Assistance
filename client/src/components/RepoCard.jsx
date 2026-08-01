import { Star } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import Button from "./Button.jsx";
import { Link } from "react-router-dom";
import {
  useDeleteRepository,
  useIndexRepository,
} from "../hooks/useRepositories.js";

function RepoCard({ repository }) {
  const deleteRepo = useDeleteRepository();
  const indexRepo = useIndexRepository();

  const isIndexing =
    indexRepo.isPending || repository.indexingStatus === "indexing";

  function handleDelete() {
    if (confirm(`Remove "${repository.fullName}"? This cannot be undone.`)) {
      deleteRepo.mutate(repository._id);
    }
  }

  function handleIndex() {
    indexRepo.mutate(repository._id);
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-mono text-textPrimary font-medium">
            {repository.fullName}
          </h3>
          {repository.description && (
            <p className="text-textSecondary text-sm mt-1 line-clamp-2">
              {repository.description}
            </p>
          )}
        </div>
        <StatusBadge status={repository.indexingStatus} />
      </div>

      <div className="flex items-center gap-4 text-textSecondary text-sm mt-4">
        {repository.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            {repository.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star size={14} />
          {repository.stars}
        </span>
        {repository.isPrivate && (
          <span className="text-xs bg-surfaceHover px-2 py-0.5 rounded">
            Private
          </span>
        )}
        {repository.indexingStatus === "completed" && (
          <span className="text-xs">
            {repository.filesIndexed} files · {repository.chunksIndexed} chunks
          </span>
        )}
      </div>

      {repository.indexingStatus === "failed" && repository.indexingError && (
        <p className="text-red-400 text-xs mt-3">{repository.indexingError}</p>
      )}

      {indexRepo.isError && (
        <p className="text-red-400 text-xs mt-3">
          {indexRepo.error.response?.data?.message || "Indexing failed."}
        </p>
      )}

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:underline"
        >
          View on GitHub
        </a>

        {repository.indexingStatus === "completed" && (
          <>
            <Link
              to={`/repos/${repository._id}/chat`}
              className="text-sm text-accent hover:underline"
            >
              Chat
            </Link>

            <Link
              to={`/repos/${repository._id}/insights`}
              className="text-xs text-textSecondary hover:bg-surfaceHover rounded px-2 py-1"
            >
              Insights
            </Link>
          </>
        )}


        <div className="ml-auto flex items-center gap-3">
          <div className="w-28">
            <Button
              variant="secondary"
              onClick={handleIndex}
              isLoading={isIndexing}
              disabled={isIndexing}
            >
              {repository.indexingStatus === "completed"
                ? "Re-index"
                : "Index"}
            </Button>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleteRepo.isPending}
            className="text-sm text-red-400 hover:underline disabled:opacity-50"
          >
            {deleteRepo.isPending ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RepoCard;