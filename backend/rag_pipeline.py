from dotenv import load_dotenv
load_dotenv()

import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq


# Global vector database
vector_db = None


def process_document(file):
    global vector_db

    # Save uploaded file temporarily
    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(file.file.read())

    # Load PDF
    loader = PyPDFLoader(file_location)
    documents = loader.load()

    # Split document into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(documents)

    # Create embeddings
    embeddings = HuggingFaceEmbeddings()

    # Store inside FAISS vector database
    vector_db = FAISS.from_documents(chunks, embeddings)

    return "Document processed successfully"


def ask_question(question):
    global vector_db

    if vector_db is None:
        return "Please upload a document first."

    # Initialize Groq LLM
    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model="llama-3.3-70b-versatile"
    )

    # Retrieve relevant document chunks
    retriever = vector_db.as_retriever()

    docs = retriever.invoke(question)[:4]

    # Combine retrieved context
    context = "\n".join([doc.page_content for doc in docs])

    # Create prompt
    prompt = f"""
Use the following context to answer the question:

{context}

Question:
{question}
"""

    # Generate response
    response = llm.invoke(prompt)

    return response.content