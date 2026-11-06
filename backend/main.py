import os
from uuid import uuid4, UUID

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from groq import Groq
from pydantic import BaseModel

from database import get_db
from models import Conversation, Message

load_dotenv()

app = FastAPI(title="NEXUS AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MAX_HISTORY_MESSAGES = 20


class ChatRequest(BaseModel):
    message: str
    chat_id: str | None = None


@app.get("/")
def home():
    return {"message": "NEXUS backend is running!"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):

    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Groq API key is missing."
        )

    # STEP 1: Find or create conversation

    if request.chat_id:

        try:
            chat_id = UUID(request.chat_id)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid conversation ID."
            )

        conversation = db.query(Conversation).filter(
            Conversation.id == chat_id
        ).first()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found."
            )

    else:

        conversation = Conversation(
            title=request.message[:50]
        )

        db.add(conversation)
        db.flush()

        chat_id = conversation.id

    # STEP 2: Retrieve previous messages

    previous_messages = (
        db.query(Message)
        .filter(Message.conversation_id == chat_id)
        .order_by(Message.created_at.desc(), Message.id.desc())
        .limit(MAX_HISTORY_MESSAGES)
        .all()
    )

    previous_messages.reverse()

    history = [
        {
            "role": msg.role,
            "content": msg.content
        }
        for msg in previous_messages
    ]

    # STEP 3: Prepare messages for Groq

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

    messages = [
        {
            "role": "system",
            "content": system_instruction
        },
        *history,
        {
            "role": "user",
            "content": request.message
        }
    ]

    # STEP 4: Get response from Groq

    try:

        client = Groq(api_key=api_key)

        response = client.chat.completions.create(
            model=model,
            messages=messages
        )

        reply = response.choices[0].message.content or ""

    except Exception as e:

        db.rollback()

        print("Groq Error:", repr(e))

        raise HTTPException(
            status_code=502,
            detail="Groq request failed. Check the backend terminal."
        )

    # STEP 5: Save both messages in PostgreSQL

    try:

        user_message = Message(
            conversation_id=chat_id,
            role="user",
            content=request.message
        )

        assistant_message = Message(
            conversation_id=chat_id,
            role="assistant",
            content=reply
        )

        db.add_all([
            user_message,
            assistant_message
        ])

        db.commit()

    except Exception as e:

        db.rollback()

        print("Database Error:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to save conversation."
        )

    return {
        "chat_id": str(chat_id),
        "reply": reply
    }
