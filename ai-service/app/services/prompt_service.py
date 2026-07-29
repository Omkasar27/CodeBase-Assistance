from app.schemas.query import ChatMessage

SYSTEM_PROMPT = (
    "You are an AI assistant that helps developers understand a codebase. "
    "Answer the user's question using ONLY the provided code context below. "
    "If the context doesn't contain enough information to answer confidently, "
    "say so honestly instead of guessing. Reference specific file paths when "
    "relevant. Keep answers clear and concise."
)

MAX_HISTORY_MESSAGES = 6


def build_messages(
    question: str, chunks: list[dict], chat_history: list[ChatMessage]
) -> list[dict]:
    if chunks:
        context_blocks = [
            f"File: {chunk['file_path']}\n```\n{chunk['text']}\n```"
            for chunk in chunks
        ]
        context_text = "\n\n".join(context_blocks)
    else:
        context_text = "No relevant code context was found for this question."

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    recent_history = chat_history[-MAX_HISTORY_MESSAGES:]
    for msg in recent_history:
        messages.append({"role": msg.role, "content": msg.content})

    user_message = f"Context from the codebase:\n\n{context_text}\n\nQuestion: {question}"
    messages.append({"role": "user", "content": user_message})

    return messages