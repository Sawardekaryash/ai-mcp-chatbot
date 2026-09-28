import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from mcp.server import MCPServer
from database.database import get_messages


mcp = MCPServer("AI Chatbot MCP Server")


@mcp.tool()
def get_chat_history() -> str:
    """Retrieve the chat history stored in the SQLite database."""
    messages = get_messages()

    if not messages:
        return "No chat history found."

    history = []

    for message in messages:
        history.append(
            f"{message['role']}: {message['message']}"
        )

    return "\n".join(history)


if __name__ == "__main__":
    mcp.run()