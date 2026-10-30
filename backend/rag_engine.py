"""
CivicPulse - Local Ollama + ChromaDB RAG Engine
Grounds raw citizen reports in official municipal Standard Operating Procedures (SOPs)
"""
import os
import json
import httpx

CIVIC_SOPS = [
  {
    "code": "SOP-ROAD-01",
    "category": "roads",
    "title": "Severe Arterial Pothole & Road Subsidence Rapid Remediation",
    "target_hazard": "Potholes > 10cm depth, cave-ins on transit routes, asphalt fractures",
    "crew_type": "Asphalt Rapid Response Unit (3-4 workers)",
    "required_equipment": ["Cold/Warm asphalt batch truck", "Plate compactor & vibratory roller", "Barricades"],
    "step_by_step_action": [
      "1. Zone isolation: Erect barricades and reroute one traffic lane with certified flagger.",
      "2. Clean & square edges: Chisel vertical rectangular edges around damaged depression.",
      "3. Moisture removal: Blow out standing debris and dry cavity using hot-air lance.",
      "4. Prime coat: Spray bituminous binder emulsion along base and perimeter walls.",
      "5. Compaction: Execute minimum 4 passes with vibratory plate compactor to 95% standard density."
    ]
  },
  {
    "code": "SOP-WATER-04",
    "category": "water_drainage",
    "title": "Stormwater Culvert Blockage, Silt Hydro-Jetting & Dewatering Protocol",
    "target_hazard": "Culvert siltation, urban street inundation > 15cm, catch basin backup",
    "crew_type": "Municipal Hydro-Vac & Dewatering Squad (3 workers)",
    "required_equipment": ["High-pressure combo jetter / vacuum suction tanker", "Trash pump", "Gas detector"],
    "step_by_step_action": [
      "1. Depth assessment: Measure flood depth and identify intake inlet and downstream manhole.",
      "2. Immediate dewatering: Position submersible trash pump to relieve standing street water.",
      "3. High-pressure jetting: Feed rotating jetter hose upstream against water flow at 2,000 PSI.",
      "4. Slurry extraction: Vacuum liquified silt and trapped solid refuse directly into tank chamber."
    ]
  },
  {
    "code": "SOP-ELEC-02",
    "category": "electricity_lighting",
    "title": "Downed Live Electrical Conductor & High-Voltage Hazard Mitigation",
    "target_hazard": "Exposed energized wires, sparking transformers, vehicle collision with lighting pole",
    "crew_type": "Emergency Lineman & Grid Safety Unit (2 certified lineworkers)",
    "required_equipment": ["Insulated bucket truck (46kV rated)", "High-voltage hot sticks", "Voltage detector wand"],
    "step_by_step_action": [
      "1. Emergency cordon: Police exclusion zone setup around conductive wet surfaces.",
      "2. Remote grid trip: Request SCADA dispatcher to lock out and tag out feeder breaker.",
      "3. Visual & field testing: Test wire with proximity audio/visual voltage detector.",
      "4. Grounding: Attach protective grounds to dissipate any residual or induced capacitance."
    ]
  }
]

class CivicRAGEngine:
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url

    async def generate_action_brief(self, report_data: dict) -> dict:
        category = report_data.get("category", "roads")
        matching_sops = [s for s in CIVIC_SOPS if s["category"] == category]
        sop = matching_sops[0] if matching_sops else CIVIC_SOPS[0]

        prompt = f"""
        You are a Senior Municipal Operations Dispatcher.
        Generate a 60-second executive action brief for this report:
        Title: {report_data.get('title')}
        Category: {report_data.get('category')}
        Location: {report_data.get('address', 'Downtown')}
        Description: {report_data.get('rawDescription', report_data.get('description', ''))}

        Ground in Municipal SOP {sop['code']}: {sop['title']}.
        Target Hazard: {sop['target_hazard']}
        Standard Crew: {sop['crew_type']}

        Return JSON:
        {{
            "executiveSummary": "1 concise sentence operational summary",
            "rootCauseHypothesis": "Underlying infrastructure cause",
            "immediateRiskToLifeOrProperty": "Risk if untreated for 24h",
            "requiredDispatchUnit": "{sop['crew_type']}",
            "equipmentChecklist": {json.dumps(sop['required_equipment'])},
            "estimatedCrewSize": 3,
            "estimatedBudgetUsd": 1200,
            "stepByStepActionPlan": {json.dumps(sop['step_by_step_action'])},
            "citizenCommunicationTemplate": "Municipal crew dispatched under {sop['code']}."
        }}
        """

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                resp = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": "llama3:8b",
                        "prompt": prompt,
                        "format": "json",
                        "stream": False
                    }
                )
                if resp.status_code == 200:
                    parsed = json.loads(resp.json()["response"])
                    parsed["retrievedSopCodes"] = [sop["code"]]
                    parsed["modelUsed"] = "Ollama llama3:8b (Local RAG)"
                    return parsed
        except Exception as e:
            print(f"Ollama RAG fallback: {e}")

        return {
            "executiveSummary": f"Immediate dispatch authorized under {sop['code']} to address reported condition.",
            "rootCauseHypothesis": f"Infrastructure wear matching {sop['target_hazard']}.",
            "retrievedSopCodes": [sop["code"]],
            "immediateRiskToLifeOrProperty": "Compounding secondary hazard to public pedestrian and vehicular transit.",
            "requiredDispatchUnit": sop["crew_type"],
            "equipmentChecklist": sop["required_equipment"],
            "estimatedCrewSize": 3,
            "estimatedBudgetUsd": 1150,
            "stepByStepActionPlan": sop["step_by_step_action"],
            "citizenCommunicationTemplate": f"CivicPulse has dispatched our {sop['crew_type']} under protocol {sop['code']}.",
            "modelUsed": "Deterministic Municipal Knowledge Engine"
        }
