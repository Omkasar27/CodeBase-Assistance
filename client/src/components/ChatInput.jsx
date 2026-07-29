import { useState } from "react";
import Button from "./Button.jsx";

function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask a question about this codebase..."
        disabled={disabled}
        className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-textPrimary placeholder:text-textSecondary/50 outline-none focus:border-accent disabled:opacity-50"
      />
      <div className="w-24">
        <Button type="submit" disabled={disabled || !value.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
}

export default ChatInput;