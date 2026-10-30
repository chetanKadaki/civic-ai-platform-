import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_SYNTHETIC_REPORTS, INITIAL_CLUSTERS } from './src/data/syntheticReports.ts';
import { CIVIC_SOPS } from './src/data/civicSops.ts';
import { CivicReport, ActionBrief, DuplicateMatch } from './src/types/civic.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store for live sessions
let reports: CivicReport[] = JSON.parse(JSON.stringify(INITIAL_SYNTHETIC_REPORTS));
let clusters = JSON.parse(JSON.stringify(INITIAL_CLUSTERS));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Distance helper between two percentage points (approximate map meters)
function computeApproxDistanceMeters(p1: { xPercent: number; yPercent: number }, p2: { xPercent: number; yPercent: number }): number {
  const dx = (p1.xPercent - p2.xPercent) * 25; // approx 25m per 1%
  const dy = (p1.yPercent - p2.yPercent) * 25;
  return Math.round(Math.sqrt(dx * dx + dy * dy));
}

// Semantic token overlap similarity calculator (Jaccard + Trigram fallback)
function computeTextSimilarity(t1: string, t2: string): number {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const words1 = new Set(clean(t1));
  const words2 = new Set(clean(t2));
  if (words1.size === 0 || words2.size === 0) return 0;
  let intersect = 0;
  for (const w of words1) {
    if (words2.has(w)) intersect++;
  }
  const union = new Set([...words1, ...words2]).size;
  return Math.round((intersect / union) * 100);
}

// Find potential duplicate among active reports
function checkDuplicateHeuristic(
  newTitle: string,
  newDesc: string,
  newCategory: string,
  newCoords: { xPercent: number; yPercent: number }
): DuplicateMatch {
  let highestScore = 0;
  let matchedReport: CivicReport | null = null;
  let minDistance = 9999;

  for (const rep of reports) {
    // Check spatial proximity
    const dist = computeApproxDistanceMeters(newCoords, rep.coords);
    if (dist > 350) continue; // Further than 350 meters is rarely duplicate

    const textSim = computeTextSimilarity(`${newTitle} ${newDesc}`, `${rep.title} ${rep.rawDescription}`);
    const catMatch = rep.category === newCategory ? 15 : 0;
    const distBonus = Math.max(0, 30 - Math.round(dist / 10)); // up to 30 pts for proximity

    const combinedScore = Math.min(99, Math.round(textSim * 0.6 + catMatch + distBonus));

    if (combinedScore > highestScore) {
      highestScore = combinedScore;
      matchedReport = rep;
      minDistance = dist;
    }
  }

  if (highestScore >= 65 && matchedReport) {
    return {
      isDuplicate: true,
      parentReportId: (matchedReport as CivicReport).id,
      confidenceScore: highestScore,
      distanceMeters: minDistance,
      reasoning: `Found existing ticket ${(matchedReport as CivicReport).trackingCode} ("${(matchedReport as CivicReport).title}") located ~${minDistance}m away with high semantic overlap (${highestScore}% match). Recommend linking to consolidate dispatch.`
    };
  }

  return {
    isDuplicate: false,
    confidenceScore: highestScore,
    reasoning: highestScore > 0 ? `Nearest related complaint is ~${minDistance}m away with low similarity (${highestScore}%). Recorded as distinct incident.` : 'No spatially or semantically proximate active complaint detected within 350m radius.'
  };
}

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasGeminiKey: !!geminiApiKey,
    reportCount: reports.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/download-zip', (_req: Request, res: Response) => {
  const zipPath = path.join(__dirname, 'public', 'cgk.zip');
  res.download(zipPath, 'cgk.zip');
});

app.get('/api/download-cgk', (_req: Request, res: Response) => {
  const zipPath = path.join(__dirname, 'public', 'cgk.zip');
  res.download(zipPath, 'cgk.zip');
});

app.get('/setup_project.py', (_req: Request, res: Response) => {
  const scriptPath = path.join(__dirname, 'public', 'setup_project.py');
  res.download(scriptPath, 'setup_project.py');
});

app.get('/api/reports', (_req: Request, res: Response) => {
  res.json(reports);
});

app.post('/api/reports', (req: Request, res: Response) => {
  const newReport: CivicReport = req.body;
  if (!newReport.id) {
    newReport.id = `rep-${Date.now()}`;
  }
  if (!newReport.trackingCode) {
    newReport.trackingCode = `CP-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  reports.unshift(newReport);
  res.status(201).json(newReport);
});

app.patch('/api/reports/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = reports.findIndex(r => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }
  reports[index] = { ...reports[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(reports[index]);
});

app.post('/api/reset-data', (_req: Request, res: Response) => {
  reports = JSON.parse(JSON.stringify(INITIAL_SYNTHETIC_REPORTS));
  clusters = JSON.parse(JSON.stringify(INITIAL_CLUSTERS));
  res.json({ message: 'Database reset to initial synthetic dataset', count: reports.length });
});

app.get('/api/clusters', (_req: Request, res: Response) => {
  res.json(clusters);
});

// AI Analyze Citizen Complaint
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  try {
    const { title, description, category, coords, address, zone } = req.body;

    const fallbackDuplicate = checkDuplicateHeuristic(
      title || '',
      description || '',
      category || 'roads',
      coords || { xPercent: 50, yPercent: 50 }
    );

    // If Gemini client is active, use it for enriched analysis
    if (ai) {
      try {
        const prompt = `
You are the AI Triage Engine for CivicPulse, a municipal civic emergency platform.
Analyze this citizen report:
Title: ${title}
Description: ${description}
Category: ${category}
Address: ${address || 'Downtown'} (Zone: ${zone || 'Sector 1'})

Task:
1. Validate category or reclassify to one of: 'roads', 'water_drainage', 'waste_sanitation', 'electricity_lighting', 'public_safety', 'parks_trees'.
2. Provide a crisp 1-sentence executive AI summary.
3. Calculate an explainable priority total score (0 to 100) using these exact weights:
   - severityScore (0 to 35): Physical hazard severity, injury risk, structural damage
   - vulnerabilityZoneScore (0 to 25): Proximity to schools, hospitals, transit hubs, playgrounds
   - publicImpactScore (0 to 20): Number of people, vehicles, or commuters blocked/threatened
   - repeatEscalationScore (0 to 20): Urgency growth and public distress
4. Set priority level: "critical" (85-100), "high" (70-84), "medium" (50-69), or "low" (0-49).
5. Explain in 1-2 clear sentences why this score was assigned.
6. Recommend the ideal municipal department to dispatch.
7. Estimated turnaround hours (2 to 48).

Return strictly valid JSON:
{
  "aiSummary": "...",
  "validatedCategory": "...",
  "priority": {
    "totalScore": 88,
    "level": "critical",
    "severityScore": 30,
    "vulnerabilityZoneScore": 22,
    "publicImpactScore": 18,
    "repeatEscalationScore": 18,
    "explanation": "..."
  },
  "assignedDepartment": "...",
  "estimatedResolutionHours": 4
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const jsonStr = (response.text ?? '{}').trim();
        const parsed = JSON.parse(jsonStr);

        res.json({
          ...parsed,
          duplicateInfo: fallbackDuplicate,
          modelUsed: 'gemini-3.8-flash'
        });
        return;
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to deterministic heuristic triage:', geminiErr);
      }
    }

    // Deterministic Heuristic Engine Fallback
    const descLower = (description + ' ' + title).toLowerCase();
    let sev = 18;
    let vuln = 14;
    let imp = 12;
    let esc = 12;

    // Severity keywords
    if (/electric|shock|440v|spark|live wire|electrocution|cave-in|sinkhole|collapse/.test(descLower)) sev = 34;
    else if (/flooding|burst|waterlogging|crater|deep|blocked|sewer|manhole/.test(descLower)) sev = 28;
    else if (/pothole|leak|smell|trash|branch/.test(descLower)) sev = 20;

    // Vulnerability keywords
    if (/school|hospital|kindergarten|playground|transit|subway|station/.test(descLower)) vuln = 24;
    else if (/arterial|main road|avenue|market|plaza/.test(descLower)) vuln = 18;

    // Impact keywords
    if (/bus|trapping|cars|stranding|crowd|multiple|all lanes/.test(descLower)) imp = 19;
    else if (/pedestrian|traffic|bicycles/.test(descLower)) imp = 15;

    const total = Math.min(99, sev + vuln + imp + esc);
    let level: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    if (total >= 85) level = 'critical';
    else if (total >= 70) level = 'high';
    else if (total < 50) level = 'low';

    const depts: Record<string, string> = {
      roads: 'Department of Public Works (Roads)',
      water_drainage: 'Water Supply & Sewerage Board',
      waste_sanitation: 'Municipal Sanitation & Waste Management',
      electricity_lighting: 'Power & Grid Emergency Services',
      public_safety: 'City Public Safety & Traffic Dispatch',
      parks_trees: 'Urban Forestry & Parks Maintenance'
    };

    res.json({
      aiSummary: title.length > 50 ? title : `${title} requiring prompt municipal evaluation.`,
      validatedCategory: category || 'roads',
      priority: {
        totalScore: total,
        level,
        severityScore: sev,
        vulnerabilityZoneScore: vuln,
        publicImpactScore: imp,
        repeatEscalationScore: esc,
        explanation: `${level.toUpperCase()} priority assigned based on ${sev >= 28 ? 'high physical hazard severity' : 'moderate degradation'} and ${vuln >= 20 ? 'close proximity to public sensitive zone' : 'general urban impact'}.`
      },
      duplicateInfo: fallbackDuplicate,
      assignedDepartment: depts[category] || 'Department of Public Works',
      estimatedResolutionHours: total > 85 ? 4 : total > 70 ? 12 : 24,
      modelUsed: 'CivicPulse Deterministic Triage Engine'
    });
  } catch (err) {
    console.error('Error analyzing report:', err);
    res.status(500).json({ error: 'Internal error analyzing report' });
  }
});

// AI RAG Action Brief Generator
app.post('/api/ai/action-brief', async (req: Request, res: Response) => {
  try {
    const { report } = req.body;
    if (!report) {
      res.status(400).json({ error: 'Report is required' });
      return;
    }

    // Step 1: RAG Retrieval - Find relevant SOPs from knowledge base
    const matchedSops = CIVIC_SOPS.filter(
      sop => sop.category === report.category || report.rawDescription.toLowerCase().includes(sop.category.replace('_', ' '))
    );
    const primarySop = matchedSops[0] || CIVIC_SOPS[0];
    const retrievedCodes = matchedSops.map(s => s.code);

    if (ai) {
      try {
        const prompt = `
You are the Chief Municipal Incident Commander preparing a 60-Second Executive Action Brief for a city decision-maker.

CITIZEN COMPLAINT REPORT:
Title: ${report.title}
Category: ${report.category}
Location: ${report.address} (${report.zone})
Description: ${report.rawDescription}
Priority: ${report.priority.level} (Score: ${report.priority.totalScore}/100)

RETRIEVED MUNICIPAL STANDARD OPERATING PROCEDURES (SOPs):
${JSON.stringify(matchedSops, null, 2)}

TASK: Synthesize the complaint with the retrieved municipal SOP to produce an actionable, concise decision brief.
Return strictly valid JSON:
{
  "executiveSummary": "1 concise sentence summarizing the incident and required response",
  "rootCauseHypothesis": "Underlying infrastructure cause",
  "immediateRiskToLifeOrProperty": "Concrete consequences if not remedied within 24 hours",
  "requiredDispatchUnit": "Unit name and specialty",
  "equipmentChecklist": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "estimatedCrewSize": 3,
  "estimatedBudgetUsd": 1250,
  "stepByStepActionPlan": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ..."
  ],
  "citizenCommunicationTemplate": "Clear reassuring 1-sentence update text message for citizen tracking portal"
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const jsonStr = (response.text ?? '{}').trim();
        const parsed = JSON.parse(jsonStr);

        const brief: ActionBrief = {
          reportId: report.id,
          reportTitle: report.title,
          retrievedSopCodes: retrievedCodes,
          generatedAt: new Date().toISOString(),
          modelUsed: 'gemini-3.8-flash (RAG Grounded)',
          ...parsed
        };

        res.json(brief);
        return;
      } catch (geminiErr) {
        console.warn('Gemini action brief generation failed, using SOP grounded heuristic synthesis:', geminiErr);
      }
    }

    // Fallback RAG synthesis using retrieved SOP
    const brief: ActionBrief = {
      reportId: report.id,
      reportTitle: report.title,
      executiveSummary: `Immediate dispatch authorized under ${primarySop.code} to address ${report.title.toLowerCase()} in ${report.zone}.`,
      rootCauseHypothesis: `Infrastructure wear combined with urban surface stress matching ${primarySop.targetHazard}.`,
      retrievedSopCodes: retrievedCodes,
      immediateRiskToLifeOrProperty: 'Compounding secondary damage to roadway foundations, pedestrian hazard, and escalating citizen dissatisfaction.',
      requiredDispatchUnit: primarySop.crewType,
      equipmentChecklist: primarySop.requiredEquipment,
      estimatedCrewSize: 3,
      estimatedBudgetUsd: report.priority.level === 'critical' ? 2400 : 950,
      stepByStepActionPlan: primarySop.stepByStepAction,
      citizenCommunicationTemplate: `CivicPulse Dispatch has routed your report to our ${primarySop.crewType}. Safety measures are active and work is scheduled under ${primarySop.code}.`,
      generatedAt: new Date().toISOString(),
      modelUsed: 'CivicPulse RAG Knowledge Engine'
    };

    res.json(brief);
  } catch (err) {
    console.error('Error generating action brief:', err);
    res.status(500).json({ error: 'Failed to generate action brief' });
  }
});

// Configure Vite integration for dev server or static file serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicPulse server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
