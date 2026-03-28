from dotenv import load_dotenv
load_dotenv()

import os

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.document_loaders import PyPDFLoader

vector_db = None


def process_document(file):

    global vector_db

    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(file.file.read())

    loader = PyPDFLoader(file_location)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings()

    vector_db = FAISS.from_documents(chunks, embeddings)

    return "Document processed successfully"


def ask_question(question):

    global vector_db

    if vector_db is None:
        return "Please upload a document first."

    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model="mixtral-8x7b-32768"
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vector_db.as_retriever()
    )

    response = qa_chain.run(question)

    return response