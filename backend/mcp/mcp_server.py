from mcp.server.mcpserver import MCPServer

mcp = MCPServer("Brightlant AI MCP")


@mcp.tool()
def calculate(expression: str) -> str:
    """Calculate a mathematical expression."""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception:
        return "I could not calculate that expression."


@mcp.tool()
def get_project_info() -> str:
    """Get information about the Brightlant AI Chatbot project."""
    return (
        "Brightlant AI Chatbot is built using "
        "React, Flask, Python and Model Context Protocol (MCP)."
    )


@mcp.tool()
def greet_user(name: str) -> str:
    """Generate a greeting for a user."""
    return f"Hello {name}! 👋 Welcome to Brightlant AI."


if __name__ == "__main__":
    mcp.run(
        transport="streamable-http",
        host="127.0.0.1",
        port=8001
    )