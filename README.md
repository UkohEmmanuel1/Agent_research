# Nexus Research Agent — MVP

Full-stack evidence-grounded research assistant: **FastAPI + SQLite + Tavily + OpenAI-compatible LLM + Next.js**.

## Features

- Web search and citation links using Tavily
- Markdown research synthesis based on retrieved snippets
- Saved report history in SQLite
- Responsive Next.js research dashboard
- Health and research endpoints with Swagger documentation
- Evidence-only mode when an LLM key is missing; explicit unconfigured mode when search is unavailable

> **MVP limitations:** Source text is taken from search-result snippets, not full-paper retrieval; citations are numbered but not independently fact-checked. No authentication, multi-user isolation, background jobs, academic database search, PDF ingestion or autonomous multi-step planning yet. Do not deploy publicly without authentication, rate limits, abuse protection and secure persistent storage.

## Requirements

- Python 3.11+
- Node.js 20.9+
- [Tavily](https://tavily.com/) API key for live web search
- OpenAI API key (or OpenAI-compatible chat completions endpoint) for AI synthesis

## Backend setup

```bash
git clone https://github.com/UkohEmmanuel1/Agent_research.git
cd Agent_research/backend
python -m venv .venv
source .venv/bin/activate       # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env           # Windows PowerShell: Copy-Item .env.example .env
```

Set `TAVILY_API_KEY` and `OPENAI_API_KEY` in `backend/.env`. You can also configure `OPENAI_BASE_URL` and `OPENAI_MODEL`.

```bash
uvicorn --env-file .env app.main:app --reload --port 8000
```

- API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Frontend setup

In a **second terminal**:

```bash
cd Agent_research/frontend        # From the directory *above* the repository
npm install
cp .env.example .env.local       # Windows PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000.

If you are already in the repository directory use `cd frontend` instead.

## Tests

```bash
cd backend
python -m pytest -q
```

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Health |
| POST | `/api/research` | Run research |
| GET | `/api/reports` | List latest reports |
| GET | `/api/reports/{report_id}` | Load report |

Example:

```bash
curl -X POST http://localhost:8000/api/research \
  -H "Content-Type: application/json" \
  -d '{"question":"What are the pros and cons of retrieval augmented generation?","max_sources":5}'
```

## Project structure

```text
backend/
  .env.example
  requirements.txt
  app/
    __init__.py
    main.py
  tests/
    test_api.py
frontend/
  .env.example
  package.json
  tsconfig.json
  next-env.d.ts
  app/
    layout.tsx
    page.tsx
    globals.css
.gitignore
README.md
```

## Security

Never commit API keys, `.env`, local databases, or node_modules. The provided `.gitignore` excludes them. This project is intended for local exploration until authentication, API quotas, input size controls, monitoring, and persistent production storage are implemented.
