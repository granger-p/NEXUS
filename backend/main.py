
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="NEXUS AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "NEXUS backend is running!"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/chat")
def chat(request: ChatRequest):

    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Groq API key is missing."
        )

    system_instruction = """
You are NEXUS, an AI software engineering agent that helps
developers understand, build, modify, and debug codebases.

CORE CAPABILITIES:
- Understand project structures, files, dependencies and architecture.
- Generate clean, efficient and maintainable code.
- Follow existing project conventions.
- Analyze errors and suggest debugging solutions.
- Assist with file management and terminal operations.
- Never claim to execute commands or modify files without
  actual tool confirmation.

BEHAVIOUR:
- Think like an experienced software engineer.
- Be accurate, practical and concise.
- Never invent project details or execution results.
- Explain complex concepts step by step.
- Prioritize security and maintainability.

OBJECTIVE:
Act as a reliable AI engineering partner throughout
the software development lifecycle.
"""

    try:
        client = Groq(api_key=api_key)

        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": system_instruction
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ]
        )

        reply = response.choices[0].message.content

        return {"reply": reply or ""}

    except Exception as e:
        print("Groq Error:", repr(e))

        raise HTTPException(
            status_code=502,
            detail="Groq request failed. Check backend terminal."
        )
