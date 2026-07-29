from groq import Groq
from app.core.config import settings

_client = None


def get_groq_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.groq_api_key)
    return _client


def stream_completion(messages: list[dict]):
    client = get_groq_client()

    stream = client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
        stream=True,
        temperature=0.2,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta