import json
from app.services.llm_service import get_groq_client
from app.core.config import settings

SYSTEM_PROMPT = (
    "You are given a verified, factual list of API routes extracted directly from "
    "a codebase's source code — the method, path, and source file are guaranteed "
    "accurate. Your only job is to write a short (under 12 words) plain-English "
    "description of what each route likely does, based on its path and file name. "
    "Do not question or restate the route data itself.\n\n"
    'Respond with ONLY valid JSON in this exact shape: {"descriptions": ["string", ...]}, '
    "with exactly one description per route, in the same order given. No markdown, no preamble."
)


def generate_route_descriptions(repo_name: str, routes: list[dict]) -> list[str]:
    client = get_groq_client()

    routes_text = "\n".join(
        f"{i+1}. {r['method']} {r['path']} (defined in {r['controller']})"
        for i, r in enumerate(routes)
    )

    user_message = f"Repository: {repo_name}\n\nRoutes:\n{routes_text}"

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
        # Groq's JSON mode requires a top-level object, not a bare array —
        # so we ask for {"descriptions": [...]} implicitly via the shape below.
        descriptions = parsed.get("descriptions", [])
    except (json.JSONDecodeError, AttributeError):
        descriptions = []

    # Pad or trim to guarantee exact alignment with the input route list —
    # the caller zips these by index, so length mismatch would misattribute descriptions.
    while len(descriptions) < len(routes):
        descriptions.append("")
    return descriptions[: len(routes)]