from app.services.llm_service import get_groq_client
from app.core.config import settings

SYSTEM_PROMPT = (
    "You are an assistant that writes concise, accurate summaries of GitHub "
    "repositories for developers who are new to the codebase. Base your summary "
    "only on the provided README and metadata — do not invent features or "
    "technologies that aren't mentioned. Keep it to 3-5 sentences."
)


def generate_repository_summary(
    repo_name: str, description: str, readme_content: str, tech_stack: dict
) -> str:
    client = get_groq_client()

    languages = ", ".join(tech_stack.get("languages", [])[:3]) or "unknown"
    frameworks = ", ".join(tech_stack.get("frameworks", [])) or "none detected"

    user_message = (
        f"Repository: {repo_name}\n"
        f"Description: {description or 'none provided'}\n"
        f"Detected languages: {languages}\n"
        f"Detected frameworks: {frameworks}\n\n"
        f"README content:\n{readme_content or 'No README available.'}\n\n"
        "Write a short summary of what this repository does and how it's built."
    )

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content