from flask import Flask
from flask_cors import CORS
from routes.chat_routes import chat_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp, url_prefix="/api")

@app.route("/")
def home():
    return {
        "message": "Brightlant AI Backend is running"
    }

@app.route("/api/health")
def health():
    return {
        "status": "success",
        "message": "Backend is healthy"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)