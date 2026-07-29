import { useState } from "react";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import { useConnectRepository } from "../hooks/useRepositories.js";

function ConnectRepoForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const connectRepo = useConnectRepository();

  function handleSubmit(e) {
    e.preventDefault();
    connectRepo.mutate(repoUrl, {
      onSuccess: () => setRepoUrl(""),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <label className="block text-sm text-textSecondary mb-1.5">
        Connect a repository
      </label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <Input
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
        </div>
        <div className="w-32">
          <Button type="submit" isLoading={connectRepo.isPending}>
            Connect
          </Button>
        </div>
      </div>

      {connectRepo.isError && (
        <p className="text-red-400 text-sm mt-2">
          {connectRepo.error.response?.data?.message ||
            "Failed to connect repository."}
        </p>
      )}
    </form>
  );
}

export default ConnectRepoForm;