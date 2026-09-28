import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from routes.chat_routes import chat_bp
from database.database import init_db


load_dotenv()


def create_app():
    app = Flask(__name__)

    CORS(app)

    init_db()

    app.register_blueprint(chat_bp, url_prefix="/api/chat")

    @app.get("/api/health")
    def health_check():
        return {
            "status": "ok",
            "message": "AI Chatbot backend is running"
        }

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )