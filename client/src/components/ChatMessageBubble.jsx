import { RotateCcw } from "lucide-react";

function ChatMessageBubble({ role, content, sources, isLast, onRegenerate, isStreaming }) {
  const isUser = role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-accent text-background"
            : "bg-surface border border-border text-textPrimary"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
          {content === "" && !isUser && (
            <span className="inline-block w-2 h-4 bg-textSecondary/50 animate-pulse align-middle ml-0.5" />
          )}
        </p>

        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
            {sources.map((source, i) => (
              <span
                key={i}
                className="font-mono text-xs bg-surfaceHover px-2 py-0.5 rounded text-textSecondary"
              >
                {source.filePath}
              </span>
            ))}
          </div>
        )}
      </div>

      {!isUser && isLast && content !== "" && !isStreaming && (
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-xs text-textSecondary hover:text-textPrimary mt-1.5 px-1"
        >
          <RotateCcw size={12} />
          Regenerate
        </button>
      )}
    </div>
  );
}

export default ChatMessageBubble;