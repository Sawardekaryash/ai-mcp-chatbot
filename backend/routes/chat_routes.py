from flask import Blueprint, request, jsonify
from services.ai_service import get_ai_response

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json(silent=True) or {}

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "error": "Message is required"
        }), 400

    reply = get_ai_response(message)

    return jsonify({
        "reply": reply
    })