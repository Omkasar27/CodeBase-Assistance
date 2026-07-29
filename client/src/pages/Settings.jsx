import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import {
  useGithubTokenStatus,
  useSaveGithubToken,
  useDeleteGithubToken,
} from "../hooks/useGithubToken.js";

function Settings() {
  const [token, setToken] = useState("");
  const { data, isLoading } = useGithubTokenStatus();
  const saveToken = useSaveGithubToken();
  const deleteToken = useDeleteGithubToken();

  function handleSave(e) {
    e.preventDefault();
    saveToken.mutate(token, {
      onSuccess: () => setToken(""),
    });
  }

  function handleRemove() {
    if (confirm("Remove your saved GitHub token?")) {
      deleteToken.mutate();
    }
  }

  return (
    <main className="px-6 py-10">
      <div className="max-w-xl mx-auto">
        <p className="font-mono text-sm text-accent tracking-widest uppercase">
          Settings
        </p>
        <h1 className="text-2xl font-semibold text-textPrimary mt-1 mb-8">
          GitHub Access Token
        </h1>

        <div className="bg-surface border border-border rounded-xl p-6">
          <p className="text-textSecondary text-sm mb-5 leading-relaxed">
            Add a GitHub Personal Access Token to connect private
            repositories and raise your API rate limit. We encrypt this
            token before storing it, and never expose it back to the
            browser once saved.
          </p>

          {!isLoading && data?.hasToken ? (
            <div className="flex items-center justify-between">
              <span className="text-accent text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Token connected
              </span>
              <Button
                variant="secondary"
                onClick={handleRemove}
                isLoading={deleteToken.isPending}
              >
                Remove Token
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <Input
                type="password"
                placeholder="github_pat_..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              {saveToken.isError && (
                <p className="text-red-400 text-sm mb-3">
                  {saveToken.error.response?.data?.message ||
                    "Failed to save token."}
                </p>
              )}
              <Button type="submit" isLoading={saveToken.isPending}>
                Save Token
              </Button>
            </form>
          )}
        </div>

        <p className="text-textSecondary text-xs mt-4">
          Need a token?{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Create one on GitHub
          </a>{" "}
          with read-only repository access.
        </p>
      </div>
    </main>
  );
}

export default Settings;