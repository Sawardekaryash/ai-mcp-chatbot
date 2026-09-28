import os
from google import genai

_client = None


def get_ai_client():
    global _client

    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        _client = genai.Client(api_key=api_key)

    return _client


def generate_response(message: str) -> str:
    client = get_ai_client()

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=message
    )

    if not interaction.output_text:
        raise RuntimeError("AI returned an empty response")

    return interaction.output_text