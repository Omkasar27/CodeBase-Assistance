import json
from app.services.llm_service import get_groq_client
from app.core.config import settings

SYSTEM_PROMPT = (
    "You are an assistant that creates a step-by-step onboarding roadmap for a "
    "developer who is completely new to a codebase, based on its actual detected "
    "structure. Order steps logically (e.g., understand entry points and overall "
    "purpose before diving into business logic). Reference only the module paths "
    "given to you in relatedModules — never invent a module or file that wasn't "
    "provided. Produce between 4 and 7 steps.\n\n"
    'Respond with ONLY valid JSON in this exact shape: {"roadmap": [{"order": 1, '
    '"title": "string", "description": "string", "relatedModules": ["string"]}]}. '
    "No markdown, no preamble."
)


def generate_learning_roadmap(
    repo_name: str,
    summary: str,
    tech_stack: dict,
    modules: list[dict],
    api_route_count: int,
    entry_points: list[str],
) -> list[dict]:
    client = get_groq_client()

    modules_text = "\n".join(
        f"- {m['path']}: {m['purpose']}" for m in modules if m.get("purpose")
    )

    user_message = (
        f"Repository: {repo_name}\n"
        f"Summary: {summary or 'not available'}\n"
        f"Languages: {', '.join(tech_stack.get('languages', []))}\n"
        f"Frameworks: {', '.join(tech_stack.get('frameworks', [])) or 'none detected'}\n"
        f"Entry points: {', '.join(entry_points) or 'none detected'}\n"
        f"API routes detected: {api_route_count}\n\n"
        f"Modules:\n{modules_text or 'none detected'}\n\n"
        "Create an onboarding roadmap for a new developer joining this project."
    )

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content

    try:
        parsed = json.loads(raw)
        roadmap = parsed.get("roadmap", [])
    except (json.JSONDecodeError, AttributeError):
        roadmap = []

    # Guarantee valid, sequential order values regardless of what the model returned —
    # the frontend sorts by this field, so it must be trustworthy.
    for i, step in enumerate(roadmap):
        step["order"] = i + 1

    return roadmap