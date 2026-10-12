# ⚖️ Youth Rights AI — Legal Guide AI

**An AI-powered legal information assistant designed to help students and young adults in India understand their rights through accessible, retrieval-grounded explanations.**

Youth Rights AI aims to make legal information easier to understand by combining document retrieval, semantic search, and large language models. The long-term goal is to help users explore relevant legal provisions, understand their meaning in simple language, and identify reliable sources for further reading.

> **Project status:** Active development — backend foundation implemented; RAG integration, frontend, testing, and deployment are ongoing goals.

---

## 📌 Project Overview

Legal information can be difficult to understand because laws, regulations, and official documents often use complex terminology. Students and young adults may not know which provisions apply to situations involving education, internships, online harassment, consumer rights, or other everyday issues.

Youth Rights AI is being developed as a legal information and decision-support application that will help users ask questions in natural language and receive understandable explanations grounded in relevant legal documents.

The project focuses on:
- Making legal information more accessible.
- Building a Retrieval-Augmented Generation (RAG) pipeline.
- Retrieving relevant information from a legal knowledge base.
- Generating explanations using an AI model.
- Supporting evidence-based responses and legal source attribution.
- Encouraging users to consult qualified legal professionals when necessary.

## 🎯 Objectives

1. Develop an AI-powered legal question-answering system.
2. Build a backend API for authentication, chat, document management, and related functionality.
3. Process legal documents for retrieval and question answering.
4. Generate embeddings and retrieve relevant information.
5. Integrate a locally running language model through Ollama.
6. Reduce unsupported AI-generated claims by grounding responses in retrieved information.
7. Build a user-friendly interface for interacting with the assistant.
8. Evaluate response quality, retrieval accuracy, and source reliability.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript / Node.js | Backend runtime |
| Express.js | REST API and routing |
| MongoDB / Mongoose | Database and data modeling |
| Ollama | Local language-model integration |
| LangChain | Components for AI and retrieval workflows |
| `@xenova/transformers` | Local transformer-based model capabilities |
| PDF parsing | Extracting text from uploaded PDF documents |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | Handling file uploads |
| Helmet | HTTP security headers |
| Express Rate Limit | API request rate limiting |
| Nodemon | Backend development workflow |

The frontend technology and deployment platform will be documented once their implementation is confirmed.

## ✅ Work Completed So Far

### 1. Project setup

- Created the `legal-guide-rag-app` Node.js project.
- Configured npm scripts for backend development and application workflows.
- Set up a dedicated backend directory named `server`.
- Organized backend code into separate folders for configuration, controllers, middleware, models, routes, and services.

### 2. Backend configuration

Implemented configuration modules for:
- Database connectivity through `server/config/db.js`.
- Ollama integration through `server/config/ollama.js`.

### 3. API controllers

Created controllers for:
- Authentication.
- Chat functionality.
- Document management.
- Administrative operations.
- Analytics.

### 4. Backend routes

Created route modules for:
- Authentication endpoints.
- Chat endpoints.
- Document endpoints.
- Administrative endpoints.

### 5. Middleware

Added middleware modules for:
- Authentication.
- Role-based authorization.
- Error handling.
- API rate limiting.

### 6. Data models

Created Mongoose models for:
- Users.
- Chats.
- Messages.
- Sessions.
- Documents.
- Embeddings.
- Analytics.

### 7. AI and document-processing services

Created service modules for:
- Embedding generation.
- PDF text processing.
- RAG-related operations.
- Vector storage and retrieval.

These modules establish the initial architecture for the AI pipeline. Their end-to-end integration and retrieval quality still need to be tested and validated.

### 8. Environment configuration

- Added a server environment example file.
- Added `.gitignore` rules to exclude environment files and generated dependencies.
- Began separating local configuration from source code to reduce the risk of exposing credentials.

**Security note:** Real credentials must remain in local environment files or secure deployment settings, never in committed source code.

### 9. GitHub integration

The project was uploaded to the existing repository:

**Repository:** [Shikha18Shukla/Youth-Rights-AI](https://github.com/Shikha18Shukla/Youth-Rights-AI)

Completed Git operations:
- Cloned the existing repository to preserve its Git history.
- Copied the backend source files into the repository.
- Added a `.gitignore` file.
- Committed the backend implementation.
- Pushed commit `b37f7eb` to the `main` branch.

The environment example file should also be checked to ensure it contains only placeholders and no real credentials.

## 🏗️ Current Backend Structure

```text
Youth-Rights-AI/
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── ollama.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── documentController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── Analytics.js
│   │   ├── Chat.js
│   │   ├── Document.js
│   │   ├── Embedding.js
│   │   ├── Message.js
│   │   ├── Session.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── documentRoutes.js
│   │
│   ├── services/
│   │   ├── embeddingService.js
│   │   ├── pdfProcessorService.js
│   │   ├── ragService.js
│   │   └── vectorStoreService.js
│   │
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── package.json
└── README.md
```

*This tree describes the backend files currently added to the repository. Additional files and frontend components may be added as development progresses.*

## 🔄 Planned RAG Workflow

The intended question-answering pipeline is:

```text
Official Legal Documents
          |
          v
   PDF Text Extraction
          |
          v
  Cleaning and Chunking
          |
          v
   Embedding Generation
          |
          v
  Vector Storage / Indexing
          |
          v
    User Legal Question
          |
          v
  Retrieve Relevant Passages
          |
          v
  Context + Question to LLM
          |
          v
  Answer with Source Evidence
```

The workflow is a development target; each stage must be integrated and evaluated before the complete pipeline can be considered operational.

## 📚 Intended Knowledge Base

The planned knowledge base may include official and authoritative materials such as:

- Constitution of India.
- University Grants Commission regulations and notifications.
- Bharatiya Nyaya Sanhita (BNS).
- Bharatiya Nagarik Suraksha Sanhita (BNSS).
- Information Technology Act, 2000.
- Consumer Protection Act, 2019.
- Relevant Ministry of Education notifications and circulars.

Documents should be collected from reliable sources, processed carefully, and kept traceable to their original publications and applicable versions.

## 🚧 Current Development Priorities

### Phase 1 — Backend foundation
- [x] Create the Node.js project and backend directory.
- [x] Organize configuration, controllers, routes, middleware, models, and services.
- [x] Create the initial authentication, chat, document, and administrative modules.
- [x] Add database and Ollama configuration modules.
- [x] Add initial embedding, PDF-processing, RAG, and vector-store service modules.
- [x] Upload the backend source code to GitHub.

### Phase 2 — Backend validation and integration
- [ ] Verify database connectivity.
- [ ] Configure and test the local Ollama model.
- [ ] Install dependencies and start the backend successfully.
- [ ] Test API endpoints and authentication flows.
- [ ] Validate PDF upload, extraction, and document processing.
- [ ] Integrate and test embedding generation and retrieval.
- [ ] Verify that chat responses use retrieved context appropriately.
- [ ] Add automated tests and improve error handling.

### Phase 3 — Knowledge-base development
- [ ] Gather authoritative legal documents.
- [ ] Implement document cleaning, chunking, and metadata extraction.
- [ ] Store document references and embeddings.
- [ ] Evaluate retrieval relevance and source attribution.
- [ ] Handle outdated or superseded legal provisions where applicable.

### Phase 4 — Frontend development
- [ ] Build the chat interface.
- [ ] Connect frontend components to backend APIs.
- [ ] Add authentication and conversation history.
- [ ] Display relevant sources alongside AI-generated explanations.
- [ ] Improve usability, accessibility, and responsive design.

### Phase 5 — Testing and deployment
- [ ] Test the complete application end to end.
- [ ] Evaluate answer correctness and retrieval quality.
- [ ] Add security checks and input validation.
- [ ] Configure production environment variables.
- [ ] Deploy the application and document setup instructions.

## 💻 Local Development

### Prerequisites

Install the following before running the backend:

- Node.js and npm.
- MongoDB, either locally or through a hosted instance.
- Ollama and a compatible model.

### 1. Clone the repository

```bash
git clone https://github.com/Shikha18Shukla/Youth-Rights-AI.git
cd Youth-Rights-AI
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a local `.env` file in the `server` directory using `.env.example` as a reference.

Fill in the appropriate database URI, authentication secret, and other required settings. Use the actual variable names expected by the application code. Never commit the populated `.env` file.

### 4. Start Ollama

Install Ollama, download a compatible model, and ensure its local service is running. Configure the model and connection settings as required by `server/config/ollama.js`.

### 5. Start the backend

```bash
npm run dev
```

The server's actual port and required environment variables depend on the current implementation. Confirm them in the server configuration before testing API requests.

## 🔐 Security and Responsible Use

- Never commit credentials, API keys, database passwords, or populated `.env` files.
- Hash user passwords rather than storing plaintext passwords.
- Validate uploaded files and incoming requests.
- Apply authentication and authorization to protected endpoints.
- Use rate limiting and secure HTTP headers.
- Avoid exposing sensitive personal information in logs or responses.
- Treat generated answers as informational, not as definitive legal advice.
- Include citations and communicate uncertainty when evidence is incomplete.
- Recommend qualified legal assistance for consequential legal matters.

## ⚖️ Disclaimer

Youth Rights AI is intended for educational and informational purposes. It is not a substitute for professional legal advice, legal representation, or consultation with a qualified lawyer. AI-generated explanations may be incomplete or incorrect. Users should verify important information against current official legal sources.

## 👩‍💻 Author

**Shikha Shukla**

B.Tech Computer Science and Engineering (Artificial Intelligence)

GitHub: [@Shikha18Shukla](https://github.com/Shikha18Shukla)

---

*Building AI tools to make legal information more accessible, understandable, and evidence-grounded.*
