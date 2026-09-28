from flask import Blueprint, jsonify, request
from services.ai_service import generate_response

chat_bp = Blueprint("chat", __name__)


@chat_bp.post("/")
def chat():
    data = request.get_json(silent=True) or {}

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "error": "Message is required"
        }), 400

    try:
        response = generate_response(message)

        return jsonify({
            "response": response
        }), 200

    except Exception as e:
        error_message = str(e)

        print(f"AI service error: {error_message}")

        # Gemini rate limit
        if "429" in error_message or "too_many_requests" in error_message:
            return jsonify({
                "error": "AI rate limit reached. Please try again later."
            }), 429

        # Gemini temporarily unavailable
        if "503" in error_message or "service_unavailable" in error_message:
            return jsonify({
                "error": "AI service is temporarily unavailable. Please try again later."
            }), 503

        # Other AI/API errors
        return jsonify({
            "error": "Failed to generate AI response"
        }), 500