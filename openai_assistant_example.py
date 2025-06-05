import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def create_assistant():
    """Create a new assistant with specific capabilities."""
    assistant = await client.beta.assistants.create(
        name="Research Assistant",
        instructions="You are a helpful research assistant.",
        model="gpt-4-turbo-preview",
        tools=[{"type": "retrieval"}]
    )
    return assistant

async def create_thread_and_message(question: str):
    """Create a new thread and add a message."""
    thread = await client.beta.threads.create()
    message = await client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=question
    )
    return thread, message

async def run_assistant(assistant_id: str, thread_id: str):
    """Run the assistant on a thread."""
    run = await client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id
    )
    return run

async def main():
    # Create an assistant
    assistant = await create_assistant()
    
    # Create a thread and add a message
    thread, message = await create_thread_and_message(
        "What are the key benefits of using the OpenAI Assistants API?"
    )
    
    # Run the assistant
    run = await run_assistant(assistant.id, thread.id)
    
    print(f"Assistant ID: {assistant.id}")
    print(f"Thread ID: {thread.id}")
    print(f"Run ID: {run.id}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main()) 