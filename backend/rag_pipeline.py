from dotenv import load_dotenv
load_dotenv()

import os
import pandas as pd
from PIL import Image
import pytesseract

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredPowerPointLoader,
    CSVLoader
)

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq


# Windows users only (required for image OCR)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# Global vector database
vector_db = None

# =========================
# DOCUMENT LOADER FUNCTION
# =========================

def load_document(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        loader = PyPDFLoader(file_path)
        return loader.load()

    elif extension == ".txt":
        loader = TextLoader(file_path)
        return loader.load()

    elif extension == ".docx":
        loader = UnstructuredWordDocumentLoader(file_path)
        return loader.load()

    elif extension == ".pptx":
        loader = UnstructuredPowerPointLoader(file_path)
        return loader.load()

    elif extension == ".csv":
        loader = CSVLoader(file_path)
        return loader.load()

    elif extension == ".xlsx":
        df = pd.read_excel(file_path)
        text = df.to_string()
        return [Document(page_content=text)]

    elif extension in [".png", ".jpg", ".jpeg"]:
        img = Image.open(file_path).convert("L")
        text = pytesseract.image_to_string(img)
        if text.strip() == "":
            return []
        return [Document(page_content=text)]

    else:
        raise ValueError("Unsupported file format")


# =========================
# DOCUMENT PROCESSING
# =========================

def process_document(file):

    global vector_db

    # Save uploaded file temporarily
    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(file.file.read())

    # Load document (multi-format support)
    documents = load_document(file_location)
    if not documents:
        return "No readable content found in the uploaded document."

    # Split document into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150
    )

    chunks = splitter.split_documents(documents)

    # Create embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2"
    )

    # Store inside FAISS vector database
    vector_db = FAISS.from_documents(chunks, embeddings)

    return "Document processed successfully"


# =========================
# QUESTION ANSWERING
# =========================

def ask_question(question):

    global vector_db

    if vector_db is None:
        return "Please upload a document first."

    # Initialize Groq LLM
    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model="llama-3.3-70b-versatile"
    )

    # Retrieve relevant chunks
    retriever = vector_db.as_retriever(
        search_kwargs={"k": 8}
    )

    docs = retriever.invoke(question)

    if not docs:
        return "I could not find relevant information in the uploaded document."

    docs = docs[:8]

    context = "\n".join([doc.page_content for doc in docs])

    # Prompt template
    prompt = f"""
    You are an intelligent document assistant.

    Answer ONLY using the provided context.
    If the answer is not in the context, say:
    "I could not find this in the uploaded document."

    Context:
    {context}

    Question:
    {question}

    Answer clearly and concisely:
    """

    # Generate response
    response = llm.invoke(prompt)

    return response.content