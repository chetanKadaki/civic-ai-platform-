# CivicPulse - AI Civic Action & Triage Platform
*PromptWars x ASTRA | AI for Civic Impact Problem Statement: From Complaints to Action*

---

## 🚀 Quick Start Guide (Local / Antigravity)

### Option 1: One-Command Launch with Docker Compose (Recommended)

1. **Clone or Extract the ZIP file**:
   ```bash
   unzip civicpulse_project.zip
   cd civicpulse
   ```

2. **Start all services (Frontend, FastAPI Backend, MySQL, Ollama)**:
   ```bash
   docker compose up -d
   ```

3. **Pull Ollama Local Model Weights (One-time download)**:
   ```bash
   docker exec -it civicpulse-ollama-1 ollama pull llama3:8b
   docker exec -it civicpulse-ollama-1 ollama pull nomic-embed-text
   ```

4. **Access the Applications**:
   - **Citizen & Municipal Web App**: [http://localhost:3000](http://localhost:3000)
   - **FastAPI Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **MySQL Database**: `localhost:3306` (User: `civic_user`, DB: `civicpulse_db`)

---

### Option 2: Running Directly on Host (Python + Node.js)

#### 1. Start the React Frontend:
```bash
npm install
npm run dev
```
The React frontend starts at `http://localhost:3000`.

#### 2. Start the FastAPI Python Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 3. Run Ollama Locally (Optional for offline AI inference):
```bash
ollama run llama3:8b
ollama pull nomic-embed-text
```

---

## 🏛️ System Architecture

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Motion.
- **Backend API**: Python FastAPI (Async), Pydantic v2, HTTPX.
- **Database**: MySQL 8.0 with `SPATIAL INDEX` and `ST_Distance_Sphere` for 250m duplicate radius queries.
- **AI Triage & RAG**: Local Ollama (`llama3:8b` for triage/briefs, `nomic-embed-text` for embeddings) + ChromaDB vector store + Google Gemini 3.8 Flash hybrid compatibility.

---

## 📋 Evaluation Checklist Covered

- [x] **Capture**: Mobile-friendly complaint submission under 1 min with text, image, category, and map coordinates.
- [x] **Understand**: Explainable 4-factor priority score (0–100), automated category validation, duplicate detection.
- [x] **Reveal**: Interactive SVG map, 5th Ave multi-issue infrastructure cascade hotspot clustering.
- [x] **Act**: Review, assign department, dispatch field crews, generate 60-second RAG Action Briefs grounded in municipal SOPs, and follow citizen live tracking timeline.
- [x] **Limitations & Honesty Note**: Transparent breakdown of real vs mocked components and edge case failure modes.
