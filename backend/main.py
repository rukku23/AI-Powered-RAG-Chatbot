from fastapi import FastAPI, UploadFile, File
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.llms import Ollama
from langchain_community.embeddings import HuggingFaceEmbeddings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for now)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = None

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global db

    with open("temp.pdf", "wb") as f:
        f.write(await file.read())

    loader = PyPDFLoader("temp.pdf")
    documents = loader.load()

    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = FAISS.from_documents(docs, embeddings)

    return {"message": "PDF processed successfully"}

@app.get("/ask")
def ask_question(q: str):
    global db

    if db is None:
        return {"answer": "Upload a PDF first"}

    docs = db.similarity_search(q)

    llm = Ollama(model="llama3")
    response = llm.invoke(docs[0].page_content + "\nQuestion: " + q)

    return {"answer": response}