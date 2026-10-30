export type ReportCategory =
  | 'roads'
  | 'water_drainage'
  | 'waste_sanitation'
  | 'electricity_lighting'
  | 'public_safety'
  | 'parks_trees';

export type ReportStatus = 'pending' | 'triaged' | 'in_progress' | 'resolved' | 'archived';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface LocationCoords {
  lat: number;
  lng: number;
  xPercent: number; // 0-100 for SVG map rendering
  yPercent: number; // 0-100 for SVG map rendering
}

export interface DuplicateMatch {
  isDuplicate: boolean;
  parentReportId?: string;
  confidenceScore: number; // 0 - 100
  reasoning: string;
  distanceMeters?: number;
}

export interface PriorityScoreBreakdown {
  totalScore: number; // 0 - 100
  level: PriorityLevel;
  severityScore: number; // 0 - 35
  vulnerabilityZoneScore: number; // 0 - 25
  publicImpactScore: number; // 0 - 20
  repeatEscalationScore: number; // 0 - 20
  explanation: string;
}

export interface ReportTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  actorRole: 'citizen' | 'ai_system' | 'dispatcher' | 'field_crew' | 'supervisor';
  statusChange?: ReportStatus;
}

export interface CivicReport {
  id: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  rawDescription: string;
  aiSummary: string;
  category: ReportCategory;
  aiValidatedCategory: ReportCategory;
  address: string;
  zone: string;
  coords: LocationCoords;
  imageUrl?: string;
  citizenName: string;
  citizenContact?: string;
  status: ReportStatus;
  priority: PriorityScoreBreakdown;
  duplicateInfo: DuplicateMatch;
  assignedDepartment?: string;
  assignedTo?: string;
  estimatedResolutionHours?: number;
  tags: string[];
  timeline: ReportTimelineEvent[];
  clusterId?: string;
  isHotspotSeed?: boolean;
}

export interface HotspotCluster {
  id: string;
  name: string;
  zone: string;
  categoryPrimary: ReportCategory;
  reportCount: number;
  reportIds: string[];
  centroid: LocationCoords;
  severityLevel: 'critical' | 'high' | 'medium';
  rootCauseAnalysis: string;
  infrastructureCascadeRisk: string;
  recommendedDepartment: string;
}

export interface CivicSOP {
  id: string;
  code: string;
  category: ReportCategory;
  title: string;
  targetHazard: string;
  standardTurnaroundHours: number;
  requiredEquipment: string[];
  crewType: string;
  safetyProtocols: string[];
  stepByStepAction: string[];
}

export interface ActionBrief {
  reportId: string;
  reportTitle: string;
  executiveSummary: string;
  rootCauseHypothesis: string;
  retrievedSopCodes: string[];
  immediateRiskToLifeOrProperty: string;
  requiredDispatchUnit: string;
  equipmentChecklist: string[];
  estimatedCrewSize: number;
  estimatedBudgetUsd: number;
  stepByStepActionPlan: string[];
  citizenCommunicationTemplate: string;
  generatedAt: string;
  modelUsed: string;
}
