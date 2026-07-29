# ⚖️ Youth Rights AI

> **An AI-powered legal rights assistant for students and young adults in India.**

Youth Rights AI helps users understand their legal rights in everyday situations by combining **Retrieval-Augmented Generation (RAG)** with official Indian legal documents. Instead of relying solely on an AI model's knowledge, every response is grounded in retrieved legal sources and presented in simple, easy-to-understand language.

---

## 🚀 Project Status

> 🚧 **Currently in Development**

* ✅ Project Planning
* ⏳ RAG Pipeline
* ⏳ Backend API
* ⏳ Frontend
* ⏳ Deployment

---

# 🎯 Goal

Make legal information accessible to every student and young adult by providing:

* 📚 Reliable legal information
* ⚖️ Official legal citations
* 💬 Simple explanations
* 🧭 Practical next steps
* 🤖 AI-powered conversational interface

---

# 🧠 What Can It Answer?

Examples:

* 🎓 My college is refusing to return my original documents.
* 💼 My internship ended but I haven't been paid.
* 📱 Someone created a fake Instagram profile using my photos.
* 🛒 An online shopping website refuses to refund my money.
* 🚨 My seniors are ragging me. What should I do?

---

# ✨ Features

* 🤖 AI Chat Interface
* 📖 Plain English Legal Explanations
* 📚 Retrieval-Augmented Generation (RAG)
* 🔍 Semantic Search
* 📌 Official Legal Citations
* ⚡ Fast API Responses
* 💾 Persistent Conversation Storage
* 🛡️ Hallucination Reduction using Retrieved Context
* 📂 Document-Based Knowledge Base

---

# 🏛️ Knowledge Base

The assistant retrieves information from official sources such as:

* 🇮🇳 Constitution of India
* 📚 UGC Regulations
* ⚖️ Bharatiya Nyaya Sanhita (BNS)
* 🛡️ Bharatiya Nagarik Suraksha Sanhita (BNSS)
* 💻 Information Technology Act
* 🛒 Consumer Protection Act
* 🏢 Ministry of Education Notifications
* 🌐 National Cyber Crime Portal Resources

---

# 🏗️ System Architecture

```text
                 User
                   │
                   ▼
          React Frontend
                   │
                   ▼
           FastAPI Backend
                   │
                   ▼
         RAG Retrieval Engine
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
 Sentence Transformers      PostgreSQL
      │
      ▼
 FAISS Vector Database
      │
      ▼
Relevant Legal Documents
      │
      ▼
 Claude / GPT API
      │
      ▼
 AI Generated Response
```

---

# ⚙️ Tech Stack

## 🎨 Frontend

| Technology      | Purpose        |
| --------------- | -------------- |
| ⚛️ React        | User Interface |
| 🎨 Tailwind CSS | Styling        |
| 🔄 Axios        | API Requests   |

---

## ⚡ Backend

| Technology  | Purpose                   |
| ----------- | ------------------------- |
| 🐍 Python   | Core Programming Language |
| ⚡ FastAPI   | REST API                  |
| 📦 Pydantic | Data Validation           |
| 🚀 Uvicorn  | ASGI Server               |

---

## 🤖 AI & RAG

| Technology                 | Purpose                  |
| -------------------------- | ------------------------ |
| 🦜 LangChain               | RAG Pipeline             |
| 📚 LlamaIndex *(Optional)* | Document Indexing        |
| 🧠 Claude API / GPT API    | Response Generation      |
| 🔎 Sentence Transformers   | Embedding Generation     |
| 📐 FAISS                   | Vector Similarity Search |

---

## 🗄️ Database

| Technology    | Purpose                 |
| ------------- | ----------------------- |
| 🐘 PostgreSQL | Store Chats & Metadata  |
| 📐 FAISS      | Store Vector Embeddings |

---

## 📄 Document Processing

| Technology                        | Purpose           |
| --------------------------------- | ----------------- |
| 📑 PyPDFLoader                    | PDF Parsing       |
| ✂️ RecursiveCharacterTextSplitter | Document Chunking |

---

# 🔄 How It Works

```text
User asks a legal question
          │
          ▼
Question converted into embeddings
          │
          ▼
FAISS searches the most relevant legal documents
          │
          ▼
Relevant legal sections are retrieved
          │
          ▼
Context + User Question sent to GPT / Claude
          │
          ▼
AI generates an easy-to-understand answer
          │
          ▼
Legal citations are included in the response
```

---

# 📂 Project Structure

```bash
Youth-Rights-AI/

├── backend/
│   ├── api/
│   ├── rag/
│   ├── database/
│   ├── services/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── assets/
│
├── data/
│   ├── raw_documents/
│   ├── processed_documents/
│   ├── chunks/
│   └── embeddings/
│
├── scripts/
│   ├── ingest.py
│   ├── chunk_documents.py
│   ├── embeddings.py
│   └── vector_store.py
│
├── requirements.txt
├── .env.example
└── README.md
```

---

# 📚 RAG Pipeline

```text
Legal Documents
       │
       ▼
Extract Text
       │
       ▼
Clean Documents
       │
       ▼
Chunk Documents
       │
       ▼
Generate Embeddings
       │
       ▼
Store in FAISS
       │
       ▼
User Question
       │
       ▼
Retrieve Relevant Chunks
       │
       ▼
Claude / GPT API
       │
       ▼
Final Answer + Citations
```

---

# 📁 Data Sources

Only trusted and official documents are used.

* 📘 Constitution of India
* 📘 University Grants Commission (UGC)
* 📘 Consumer Protection Act, 2019
* 📘 Information Technology Act, 2000
* 📘 Bharatiya Nyaya Sanhita (BNS)
* 📘 Bharatiya Nagarik Suraksha Sanhita (BNSS)
* 📘 Ministry of Education
* 📘 Government Notifications & Circulars

---

# 🛠️ Future Improvements

* 🌐 Multi-language Support
* 🎤 Voice Input
* 📱 Mobile Responsive UI
* ⭐ Bookmark Important Responses
* 📜 Conversation History
* 📍 State-specific Legal Information
* 🔎 Hybrid Search (BM25 + Vector Search)
* 📊 Response Confidence Score

---

# ⚠️ Disclaimer

This application is designed for **educational and informational purposes only**. It helps users understand legal rights based on official sources but **does not provide legal advice or replace consultation with a qualified legal professional.

---

# 👨‍💻 Author

**Made with ❤️ by Shikha Shukla**

Building AI solutions that make legal information simpler, more accessible, and easier to understand.
