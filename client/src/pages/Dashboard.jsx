import { useAuth } from "../hooks/useAuth.js";
import { useRepositories } from "../hooks/useRepositories.js";
import ConnectRepoForm from "../components/ConnectRepoForm.jsx";
import RepoCard from "../components/RepoCard.jsx";

function Dashboard() {
  const { user } = useAuth();
  const { data: repositories, isLoading, isError } = useRepositories();

  return (
    <main className="px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="font-mono text-sm text-accent tracking-widest uppercase">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-textPrimary mt-1">
            Welcome, {user?.name}
          </h1>
        </div>

        <div className="mb-8">
          <ConnectRepoForm />
        </div>

        {isLoading && (
          <p className="text-textSecondary text-center py-10">
            Loading your repositories...
          </p>
        )}

        {isError && (
          <p className="text-red-400 text-center py-10">
            Failed to load repositories. Please try refreshing.
          </p>
        )}

        {repositories && repositories.length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-8 text-textSecondary text-center">
            No repositories connected yet. Paste a GitHub URL above to get started.
          </div>
        )}

        {repositories && repositories.length > 0 && (
          <div className="grid gap-4">
            {repositories.map((repo) => (
              <RepoCard key={repo._id} repository={repo} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;