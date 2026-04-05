from fastapi import APIRouter, UploadFile, File
from rag_pipeline import process_document

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    result = process_document(file)
    return {"message": result}
