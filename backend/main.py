import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
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
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is missing."
        )

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=model,
            contents=request.message
        )

        return {"reply": response.text}

    except Exception as e:
        print("Gemini Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Gemini request failed. Check the backend terminal."
        )