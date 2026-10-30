export interface ArchitectureSnippet {
  id: string;
  title: string;
  fileName: string;
  language: string;
  category: 'fastapi' | 'mysql' | 'ollama_rag' | 'docker' | 'overview';
  description: string;
  code: string;
}

export const ARCHITECTURE_SNIPPETS: ArchitectureSnippet[] = [
  {
    id: 'arch-overview',
    title: 'System Architecture Blueprint',
    fileName: 'ARCHITECTURE.md',
    language: 'markdown',
    category: 'overview',
    description: 'High-level architectural data flow: React SPA -> FastAPI Async Backend -> MySQL Relational DB -> Ollama Local LLM & ChromaDB RAG Vector Store.',
    code: `# CivicPulse: AI Civic Impact & Triage Architecture

## 1. High-Level Topology
\`\`\`
       [ Citizen Mobile / Web App (React 19 + Tailwind) ]
                            |
                     REST / SSE (HTTP)
                            v
           [ FastAPI Async Gateway (Python 3.11) ]
           /                |                   \\
   (CRUD & Relations) (RAG Embeddings)  (Local LLM Inference)
          v                 v                     v
   [ MySQL 8.0+ ]    [ ChromaDB Vector ]    [ Ollama Engine ]
   - reports         - civic_sops           - llama3:8b (Triage & Briefs)
   - status_history  - past_complaints      - nomic-embed-text (Similarity)
   - duplicate_links
   - clusters
\`\`\`

## 2. Core Pipelines
1. **Stage 1 (Capture)**: Citizen submits report with geo-coordinates, photos, and natural language.
2. **Stage 2 (Understand & Triage)**:
   - FastAPI queries Ollama with \`nomic-embed-text\` to create a 768-dim semantic embedding.
   - Vector similarity search against active neighborhood reports within 200m radius flags duplicates.
   - Ollama \`llama3:8b\` performs structured extraction: priority score (0-100), severity breakdown, hazard category validation.
3. **Stage 3 (Reveal & Cluster)**:
   - Geospatial DBSCAN clustering in MySQL / Python identifies multi-report cascading infrastructure hotspots (e.g. drain clog + road collapse).
4. **Stage 4 (Act & RAG Action Briefs)**:
   - Municipal dispatcher requests an action brief.
   - Vector search retrieves relevant Municipal Standard Operating Procedures (SOPs).
   - Ollama synthesizes the citizen reports with SOP instructions to produce a 60-second executive operational brief.
`
  },
  {
    id: 'fastapi-main',
    title: 'FastAPI Main Application & Endpoints',
    fileName: 'backend/main.py',
    language: 'python',
    category: 'fastapi',
    description: 'FastAPI async server with endpoints for report ingestion, semantic duplicate check, explainable priority scoring, and RAG action briefs.',
    code: `"""
CivicPulse - FastAPI Async AI Gateway
Stack: FastAPI, SQLAlchemy 2.0 (Async), Ollama Client, ChromaDB
"""
import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

app = FastAPI(
    title="CivicPulse Civic AI API",
    version="1.0.0",
    description="Transforms citizen complaints into prioritized, explainable municipal actions"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3:8b")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")

# --- Pydantic Schemas ---
class Location(BaseModel):
    lat: float
    lng: float
    address: str
    zone: str

class ReportCreate(BaseModel):
    title: str
    description: str
    category: str
    location: Location
    image_url: Optional[str] = None
    citizen_name: str
    citizen_contact: Optional[str] = None

class PriorityBreakdown(BaseModel):
    total_score: int
    level: str
    severity_score: int
    vulnerability_zone_score: int
    public_impact_score: int
    repeat_escalation_score: int
    explanation: str

class DuplicateResult(BaseModel):
    is_duplicate: bool
    parent_report_id: Optional[str] = None
    confidence_score: int
    reasoning: str
    distance_meters: Optional[float] = None

class TriageResponse(BaseModel):
    report_id: str
    tracking_code: str
    ai_summary: str
    validated_category: str
    priority: PriorityBreakdown
    duplicate_info: DuplicateResult
    assigned_department: str

# --- Ollama AI Helper Functions ---
async def generate_embedding(text: str) -> List[float]:
    """Generates dense vector embeddings using Ollama's nomic-embed-text"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            f"{OLLAMA_BASE_URL}/api/embeddings",
            json={"model": EMBEDDING_MODEL, "prompt": text}
        )
        if resp.status_code == 200:
            return resp.json()["embedding"]
        raise HTTPException(status_code=500, detail="Failed to generate embedding")

async def analyze_with_ollama(report: ReportCreate) -> dict:
    """Invokes local Ollama Llama 3 to classify, summarize, and score the complaint"""
    prompt = f"""
    You are an expert civic triage AI for municipal dispatch.
    Analyze this citizen complaint:
    Category: {report.category}
    Location: {report.location.address} (Zone: {report.location.zone})
    Description: {report.description}

    Return a strictly valid JSON object with:
    {{
        "ai_summary": "1-sentence executive summary",
        "validated_category": "{report.category}",
        "priority_score": 0-100,
        "severity_score": 0-35,
        "vulnerability_score": 0-25,
        "impact_score": 0-20,
        "escalation_score": 0-20,
        "priority_level": "critical"|"high"|"medium"|"low",
        "priority_explanation": "Plain language reasoning for score",
        "recommended_department": "Name of municipal department",
        "estimated_hours": 2-48
    }}
    """
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "format": "json",
                "stream": False
            }
        )
        if resp.status_code == 200:
            import json
            return json.loads(resp.json()["response"])
        raise HTTPException(status_code=500, detail="Ollama inference failed")

# --- API Endpoints ---
@app.get("/health")
async def health_check():
    return {"status": "ok", "ollama_model": OLLAMA_MODEL, "embedding_model": EMBEDDING_MODEL}

@app.post("/api/reports/submit", response_model=TriageResponse)
async def submit_report(payload: ReportCreate):
    # 1. Get embedding for duplicate vector lookup
    embedding = await generate_embedding(f"{payload.title} {payload.description}")
    
    # 2. Run LLM triage analysis
    ai_analysis = await analyze_with_ollama(payload)
    
    # 3. In production: query MySQL & ChromaDB to check duplicates
    # Simulated duplicate logic:
    duplicate_info = DuplicateResult(
        is_duplicate=False,
        confidence_score=0,
        reasoning="No identical complaint logged within 200m in past 72 hours."
    )
    
    return TriageResponse(
        report_id="rep-new-01",
        tracking_code="CP-9901",
        ai_summary=ai_analysis["ai_summary"],
        validated_category=ai_analysis["validated_category"],
        priority=PriorityBreakdown(
            total_score=ai_analysis["priority_score"],
            level=ai_analysis["priority_level"],
            severity_score=ai_analysis["severity_score"],
            vulnerability_zone_score=ai_analysis["vulnerability_score"],
            public_impact_score=ai_analysis["impact_score"],
            repeat_escalation_score=ai_analysis["escalation_score"],
            explanation=ai_analysis["priority_explanation"]
        ),
        duplicate_info=duplicate_info,
        assigned_department=ai_analysis["recommended_department"]
    )
`
  },
  {
    id: 'mysql-schema',
    title: 'MySQL Relational Schema',
    fileName: 'database/schema.sql',
    language: 'sql',
    category: 'mysql',
    description: 'Production MySQL DDL schema with spatial indexes (ST_Point, SPATIAL INDEX) for geo-queries, foreign keys, and audit history.',
    code: `-- CivicPulse MySQL Relational Database Schema
-- Optimized for high-throughput citizen reports, spatial queries, and audit tracking

CREATE DATABASE IF NOT EXISTS civicpulse_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE civicpulse_db;

-- 1. Reports Master Table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(36) PRIMARY KEY,
    tracking_code VARCHAR(16) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    raw_description TEXT NOT NULL,
    ai_summary TEXT,
    category ENUM('roads', 'water_drainage', 'waste_sanitation', 'electricity_lighting', 'public_safety', 'parks_trees') NOT NULL,
    validated_category ENUM('roads', 'water_drainage', 'waste_sanitation', 'electricity_lighting', 'public_safety', 'parks_trees'),
    address VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geo_point POINT NOT NULL SRID 4326,
    image_url VARCHAR(512),
    citizen_name VARCHAR(100) NOT NULL,
    citizen_contact VARCHAR(100),
    status ENUM('pending', 'triaged', 'in_progress', 'resolved', 'archived') DEFAULT 'pending',
    priority_total_score INT DEFAULT 0,
    priority_level ENUM('critical', 'high', 'medium', 'low') DEFAULT 'medium',
    severity_score INT DEFAULT 0,
    vulnerability_score INT DEFAULT 0,
    public_impact_score INT DEFAULT 0,
    escalation_score INT DEFAULT 0,
    priority_explanation TEXT,
    is_duplicate BOOLEAN DEFAULT FALSE,
    parent_report_id VARCHAR(36) NULL,
    duplicate_confidence INT DEFAULT 0,
    assigned_department VARCHAR(100),
    assigned_to VARCHAR(100),
    cluster_id VARCHAR(36) NULL,
    SPATIAL INDEX(geo_point),
    INDEX idx_status (status),
    INDEX idx_priority (priority_total_score DESC),
    INDEX idx_zone (zone),
    INDEX idx_category (category),
    FOREIGN KEY (parent_report_id) REFERENCES reports(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 2. Report Status & Audit History
CREATE TABLE IF NOT EXISTS report_timeline (
    id VARCHAR(36) PRIMARY KEY,
    report_id VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    actor VARCHAR(100) NOT NULL,
    actor_role ENUM('citizen', 'ai_system', 'dispatcher', 'field_crew', 'supervisor') NOT NULL,
    status_change ENUM('pending', 'triaged', 'in_progress', 'resolved', 'archived') NULL,
    INDEX idx_report_timeline (report_id, timestamp),
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Civic Standard Operating Procedures (SOPs) for RAG Grounding
CREATE TABLE IF NOT EXISTS civic_sops (
    id VARCHAR(36) PRIMARY KEY,
    sop_code VARCHAR(32) NOT NULL UNIQUE,
    category ENUM('roads', 'water_drainage', 'waste_sanitation', 'electricity_lighting', 'public_safety', 'parks_trees') NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_hazard TEXT NOT NULL,
    standard_turnaround_hours INT DEFAULT 24,
    required_equipment JSON,
    crew_type VARCHAR(150),
    safety_protocols JSON,
    step_by_step_action JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Spatial Proximity Query (Example: Find complaints within 250 meters)
-- SELECT id, tracking_code, title, 
--        ST_Distance_Sphere(geo_point, ST_SRID(POINT(-122.4194, 37.7749), 4326)) AS distance_meters
-- FROM reports
-- WHERE ST_Distance_Sphere(geo_point, ST_SRID(POINT(-122.4194, 37.7749), 4326)) <= 250
-- ORDER BY distance_meters ASC;
`
  },
  {
    id: 'ollama-rag',
    title: 'Ollama + ChromaDB RAG Pipeline',
    fileName: 'backend/rag_engine.py',
    language: 'python',
    category: 'ollama_rag',
    description: 'Retrieval Augmented Generation (RAG) using local Ollama model to fetch municipal SOPs and generate 1-minute decision-maker action briefs.',
    code: `"""
CivicPulse - Local Ollama + ChromaDB RAG Engine
Grounds raw citizen reports in official municipal Standard Operating Procedures (SOPs)
"""
import chromadb
from chromadb.utils import embedding_functions
import httpx
import json

class CivicRAGEngine:
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        
        # Use Ollama's nomic-embed-text embedding function
        self.embedding_fn = embedding_functions.OllamaEmbeddingFunction(
            url=f"{ollama_url}/api/embeddings",
            model_name="nomic-embed-text"
        )
        
        self.sop_collection = self.chroma_client.get_or_create_collection(
            name="municipal_sops",
            embedding_function=self.embedding_fn
        )

    def seed_sops(self, sops_data: list):
        """Indexes municipal standard operating procedures into vector store"""
        ids = [sop["code"] for sop in sops_data]
        documents = [
            f"Code: {sop['code']}. Title: {sop['title']}. Target Hazard: {sop['target_hazard']}. "
            f"Crew: {sop['crew_type']}. Steps: {' '.join(sop['step_by_step_action'])}"
            for sop in sops_data
        ]
        metadatas = [{"category": sop["category"], "code": sop["code"]} for sop in sops_data]
        
        self.sop_collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
        print(f"Indexed {len(ids)} municipal SOPs in vector store.")

    async def generate_action_brief(self, report_data: dict) -> dict:
        """
        1. Retrieves relevant SOPs using dense vector similarity
        2. Prompts Ollama (llama3:8b) to synthesize a 60-second executive action brief
        """
        # Step 1: Query vector store
        query_text = f"{report_data['category']} {report_data['title']} {report_data['description']}"
        results = self.sop_collection.query(
            query_texts=[query_text],
            n_results=2
        )
        
        retrieved_sops_text = "\\n---\\n".join(results["documents"][0])
        retrieved_codes = [meta["code"] for meta in results["metadatas"][0]]

        # Step 2: Formulate grounded prompt for Ollama
        system_prompt = (
            "You are a Senior Municipal City Operations Dispatcher. "
            "Generate a crisp, 60-second executive action brief for a city decision-maker. "
            "You MUST ground your response in the retrieved Municipal Standard Operating Procedures below."
        )

        user_prompt = f"""
        CITIZEN REPORT:
        Title: {report_data['title']}
        Category: {report_data['category']}
        Location: {report_data['address']}
        Details: {report_data['description']}

        OFFICIAL MUNICIPAL SOPS RETRIEVED:
        {retrieved_sops_text}

        Generate a JSON output matching this schema:
        {{
            "executive_summary": "1 concise sentence summarizing the incident and danger",
            "root_cause_hypothesis": "Likely underlying infrastructure cause",
            "immediate_risk": "What happens if untreated for 24 hours",
            "required_unit": "Name of crew to dispatch",
            "equipment_checklist": ["Item 1", "Item 2", "Item 3"],
            "estimated_crew_size": 3,
            "estimated_cost_usd": 1200,
            "action_checklist": [
                "Step 1: ...",
                "Step 2: ...",
                "Step 3: ..."
            ],
            "citizen_sms_update": "Clear 1-sentence reassurance message for the reporting citizen"
        }}
        """

        async with httpx.AsyncClient(timeout=90.0) as client:
            resp = await client.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": "llama3:8b",
                    "system": system_prompt,
                    "prompt": user_prompt,
                    "format": "json",
                    "stream": False
                }
            )
            
            parsed = json.loads(resp.json()["response"])
            parsed["retrieved_sops"] = retrieved_codes
            return parsed
`
  },
  {
    id: 'docker-compose',
    title: 'Docker Compose Local Stack',
    fileName: 'docker-compose.yml',
    language: 'yaml',
    category: 'docker',
    description: 'One-command orchestration linking React frontend, FastAPI backend, MySQL 8.0, and Ollama service with GPU passthrough.',
    code: `version: '3.8'

services:
  # 1. Frontend Web App (React + Vite)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
    depends_on:
      - backend

  # 2. Backend Gateway (FastAPI)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - MYSQL_HOST=mysql
      - MYSQL_PORT=3306
      - MYSQL_USER=civic_user
      - MYSQL_PASSWORD=civic_secret
      - MYSQL_DB=civicpulse_db
      - OLLAMA_BASE_URL=http://ollama:11434
      - OLLAMA_MODEL=llama3:8b
      - EMBEDDING_MODEL=nomic-embed-text
    depends_on:
      - mysql
      - ollama

  # 3. Relational Database (MySQL 8.0)
  mysql:
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: civicpulse_db
      MYSQL_USER: civic_user
      MYSQL_PASSWORD: civic_secret
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

  # 4. Local AI Engine (Ollama)
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_models:/root/.ollama
    # If host has NVIDIA GPU, uncomment below:
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: all
    #           capabilities: [gpu]

volumes:
  mysql_data:
  ollama_models:
`
  }
];
