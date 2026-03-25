from fastapi import APIRouter
from rag_pipeline import ask_question

router = APIRouter()

@router.get("/chat")
def chat(question: str):
    response = ask_question(question)
    return {"answer": response}
