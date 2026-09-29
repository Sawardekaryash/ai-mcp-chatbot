import asyncio

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def get_chat_history_from_mcp():
    server_params = StdioServerParameters(
        command="python",
        args=["mcp_integration/mcp_server.py"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            result = await session.call_tool(
                "get_chat_history",
                arguments={}
            )

            return result


def get_chat_history():
    return asyncio.run(get_chat_history_from_mcp())