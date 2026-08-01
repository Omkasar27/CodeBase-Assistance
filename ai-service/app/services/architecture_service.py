import json
from app.services.llm_service import get_groq_client
from app.core.config import settings

SYSTEM_PROMPT = (
    "You are an assistant that infers a codebase's architecture purely from its "
    "folder and file structure. You have NOT read the file contents, only their "
    "names and locations, so ground every claim in that limitation — describe "
    "likely purpose based on naming conventions, never invent specific classes, "
    "functions, or logic you have no evidence for.\n\n"
    "Respond with ONLY valid JSON, no markdown fences, no preamble, matching "
    "exactly this shape:\n"
    '{"architecture_overview": "string", "modules": ['
    '{"name": "string", "path": "string", "purpose": "string", '
    '"importantFiles": ["string"]}]}'
)


def generate_architecture_overview(
    repo_name: str, tech_stack: dict, entry_points: list[str], modules: list[dict]
) -> dict:
    client = get_groq_client()

    modules_description = "\n".join(
        f"- {m['path']} ({len(m['files'])} files): {', '.join(m['files'][:8])}"
        for m in modules
    )

    user_message = (
        f"Repository: {repo_name}\n"
        f"Languages: {', '.join(tech_stack.get('languages', []))}\n"
        f"Frameworks: {', '.join(tech_stack.get('frameworks', [])) or 'none detected'}\n"
        f"Entry points found: {', '.join(entry_points) or 'none detected'}\n\n"
        f"Detected top-level modules and their files:\n{modules_description}\n\n"
        "Write a short architecture overview (3-4 sentences) describing how this "
        "codebase is likely organized, and for each module, infer its purpose "
        "and list up to 3 of its most likely-important files from the ones given."
    )

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = {
            "architecture_overview": "Unable to generate an architecture overview at this time.",
            "modules": [
                {"name": m["name"], "path": m["path"], "purpose": "", "importantFiles": m["files"][:3]}
                for m in modules
            ],
        }

    return parsed