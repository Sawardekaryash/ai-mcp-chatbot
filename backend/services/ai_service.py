import os
import json
import asyncio

from dotenv import load_dotenv
from openai import OpenAI

from services.mcp_service import get_mcp_tools, call_mcp_tool

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def get_ai_response(message):
    try:
        # Get tools from MCP server
        mcp_tools = asyncio.run(get_mcp_tools())

        # Convert MCP tools to OpenAI tools
        tools = []

        for tool in mcp_tools:
            tools.append({
                "type": "function",
                "name": tool["name"],
                "description": tool["description"],
                "parameters": tool["input_schema"]
            })

        # Send message to OpenAI
        response = client.responses.create(
            model="gpt-5.6-luna",
            input=message,
            tools=tools
        )

        # Check if AI wants to use an MCP tool
        for item in response.output:

            if item.type == "function_call":

                tool_name = item.name
                arguments = json.loads(item.arguments)

                print(f"MCP TOOL CALLED: {tool_name}")
                print(f"ARGUMENTS: {arguments}")

                # Call MCP tool
                tool_result = asyncio.run(
                    call_mcp_tool(
                        tool_name,
                        arguments
                    )
                )

                # Send MCP result back to OpenAI
                final_response = client.responses.create(
                    model="gpt-5.6-luna",
                    previous_response_id=response.id,
                    input=[
                        {
                            "type": "function_call_output",
                            "call_id": item.call_id,
                            "output": str(tool_result)
                        }
                    ]
                )

                return final_response.output_text

        # Normal AI response
        return response.output_text

    except Exception as e:
        import traceback

        print("\n========== AI ERROR ==========")
        print(repr(e))
        traceback.print_exc()
        print("==============================\n")

        return "Sorry, I couldn't process your request right now."