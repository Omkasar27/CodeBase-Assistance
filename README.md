# AI Codebase Assistant

A full-stack RAG (Retrieval-Augmented Generation) application that lets developers connect a GitHub repository and ask natural-language questions about the codebase, with answers grounded in the actual source code via semantic search.

**Live demo:** [code-base-assistance.vercel.app](https://code-base-assistance.vercel.app)

> Note: the AI service runs on free-tier hosting with ephemeral storage — if the vector index appears empty after a period of inactivity, click **Re-index** on the repository before chatting. See [Deployment Notes](#deployment-notes) for why.

---

## What it does

1. Connect a public or private GitHub repository (via an encrypted personal access token)
2. Index it — the backend fetches source files, splits them into semantically meaningful chunks using language-aware parsing, generates vector embeddings, and stores them in a per-repository vector database
3. Ask questions in a chat interface — the system retrieves the most relevant code chunks and streams a grounded answer back in real time, citing the specific files it used

---

## Architecture

```mermaid
graph LR
    subgraph Client
        A[React + Vite<br/>Tailwind, TanStack Query]
    end

    subgraph Backend
        B[Node.js / Express<br/>Auth, Repo Management,<br/>Orchestration]
    end

    subgraph AI Service
        C[Python / FastAPI<br/>Chunking, Embeddings,<br/>RAG Pipeline]
    end

    D[(MongoDB Atlas)]
    E[(ChromaDB<br/>Vector Store)]
    F[GitHub REST API]
    G[Groq LLM API]

    A -- REST + SSE --> B
    B -- Internal API<br/>+ Shared Secret --> C
    B --> D
    B --> F
    C --> E
    C --> G
```

**Why three services instead of one backend?** Node handles I/O-bound work (auth, orchestration, CRUD) while Python owns the AI/ML ecosystem (LangChain, ChromaDB, embeddings) — each service scales and deploys independently, and the AI service is never exposed directly to the internet, only reachable through Node via an internal API key.

---

## Key engineering decisions

- **Language-aware code chunking** — instead of naive fixed-size text splitting, code is split using LangChain's language-specific splitters that prefer function/class boundaries, preserving semantic coherence for better retrieval.
- **Per-repository vector isolation** — each indexed repository gets its own ChromaDB collection, so retrieval queries are structurally incapable of leaking chunks across repos or users.
- **Authorization at the data layer, not just the route layer** — every database query is scoped by `owner: userId` at the query level (not just checked in a middleware), closing a common class of IDOR (Insecure Direct Object Reference) vulnerabilities.
- **Encrypted secrets at rest** — GitHub personal access tokens are encrypted with AES-256-GCM before storage and never exposed back to the client after saving.
- **Real-time streaming via SSE** — LLM responses stream token-by-token from Groq → FastAPI → Express → the browser, using a raw Node stream pipe (not buffered), while Express simultaneously taps the same stream to persist the final message to MongoDB — two independent consumers of one stream, with zero added latency to the client.
- **Service-to-service authentication** — the internal AI service requires a shared API key on every request, even though it's not meant to be publicly reachable, as defense-in-depth against network misconfiguration.
- **Deployment-driven architecture swap** — the embedding pipeline originally used `sentence-transformers` (PyTorch-based) locally; hitting a 512MB memory ceiling on free-tier hosting led to swapping in `fastembed` (ONNX-based, no PyTorch) with zero changes to any other part of the RAG pipeline, validating the service abstraction layer built early on.

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, TanStack Query, Axios

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication

**AI Service:** Python, FastAPI, LangChain, ChromaDB, FastEmbed, Groq API

**External APIs:** GitHub REST API, Groq LLM API

**Deployment:** Vercel (frontend), Render (backend + AI service), MongoDB Atlas

---

## Project Structure
