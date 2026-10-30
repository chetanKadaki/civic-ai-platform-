import { CivicReport } from '../types/civic';

export const INITIAL_SYNTHETIC_REPORTS: CivicReport[] = [
  {
    id: 'rep-001',
    trackingCode: 'CP-1042',
    createdAt: '2026-10-29T18:30:00Z',
    updatedAt: '2026-10-30T06:15:00Z',
    title: 'Deep crater pothole in front of St. Jude Elementary',
    rawDescription: 'There is a massive pothole roughly 15cm deep right at the drop-off zone outside St. Jude Elementary on Elm Street. School buses are swerving into oncoming traffic to avoid it, and two cars have already popped their tires this morning.',
    aiSummary: 'Critical 15cm deep pothole causing vehicle tire damage and severe school bus swerving in school active drop-off zone.',
    category: 'roads',
    aiValidatedCategory: 'roads',
    address: '420 Elm Street, North Ward (St. Jude School Zone)',
    zone: 'North Ward - Sector 2',
    coords: { lat: 37.7749, lng: -122.4194, xPercent: 28, yPercent: 32 },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Elena Rostova',
    citizenContact: 'elena.r@citizen.org',
    status: 'in_progress',
    priority: {
      totalScore: 92,
      level: 'critical',
      severityScore: 32,
      vulnerabilityZoneScore: 25, // School zone
      publicImpactScore: 18,
      repeatEscalationScore: 17,
      explanation: 'Critical rating due to 15cm depth causing active vehicular damage inside an active vulnerable school transit zone during morning peak hours.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary root report filed first at 06:30 AM.'
    },
    assignedDepartment: 'Department of Public Works (Roads)',
    assignedTo: 'Crew Alpha - Asphalt Rapid Response Unit',
    estimatedResolutionHours: 6,
    tags: ['pothole', 'school-zone', 'bus-route', 'traffic-hazard'],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-10-29T18:30:00Z',
        title: 'Report Submitted',
        description: 'Citizen submitted report with photo via Mobile Applet.',
        actor: 'Elena Rostova',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-2',
        timestamp: '2026-10-29T18:32:10Z',
        title: 'AI Auto-Triage & Risk Assessment',
        description: 'AI model analyzed school zone vulnerability, classified as Critical (Score: 92/100).',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'triaged'
      },
      {
        id: 'tl-3',
        timestamp: '2026-10-30T06:15:00Z',
        title: 'Dispatched to Asphalt Unit',
        description: 'Assigned to Crew Alpha. Asphalt batch truck en route with cold-patch material.',
        actor: 'Marcus Vance (Chief Dispatcher)',
        actorRole: 'dispatcher',
        statusChange: 'in_progress'
      }
    ]
  },
  {
    id: 'rep-002',
    trackingCode: 'CP-1045',
    createdAt: '2026-10-29T19:15:00Z',
    updatedAt: '2026-10-29T19:16:00Z',
    title: 'Big dangerous pothole on Elm St by the school gate',
    rawDescription: 'Large hole in the road outside the school gate on Elm St. Very dangerous for kids crossing and cyclists.',
    aiSummary: 'Dangerous roadway depression outside school gate posing collision hazard to children and cyclists.',
    category: 'roads',
    aiValidatedCategory: 'roads',
    address: '428 Elm Street, near school crosswalk',
    zone: 'North Ward - Sector 2',
    coords: { lat: 37.7751, lng: -122.4192, xPercent: 28.5, yPercent: 32.5 },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    citizenName: 'David Chen',
    citizenContact: 'd.chen99@sample.mail',
    status: 'triaged',
    priority: {
      totalScore: 88,
      level: 'critical',
      severityScore: 30,
      vulnerabilityZoneScore: 25,
      publicImpactScore: 18,
      repeatEscalationScore: 15,
      explanation: 'Linked as semantic duplicate of #CP-1042. Proximity 12 meters, high semantic alignment on Elm St school crossing.'
    },
    duplicateInfo: {
      isDuplicate: true,
      parentReportId: 'rep-001',
      confidenceScore: 94,
      reasoning: '94% semantic and spatial match with report CP-1042 (distance 14 meters, same pothole on Elm St school crossing). Linked as child report to prevent duplicate crew dispatch.',
      distanceMeters: 14
    },
    assignedDepartment: 'Department of Public Works (Roads)',
    assignedTo: 'Crew Alpha - Asphalt Rapid Response Unit',
    tags: ['duplicate-merged', 'pothole', 'school-zone'],
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2026-10-29T19:15:00Z',
        title: 'Report Submitted',
        description: 'Report filed by David Chen.',
        actor: 'David Chen',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-5',
        timestamp: '2026-10-29T19:16:00Z',
        title: 'Duplicate Detected & Merged',
        description: 'AI detected 94% similarity with active ticket CP-1042. Citizen subscribed to master ticket updates.',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'triaged'
      }
    ]
  },
  {
    id: 'rep-003',
    trackingCode: 'CP-1050',
    createdAt: '2026-10-29T21:00:00Z',
    updatedAt: '2026-10-30T02:00:00Z',
    title: 'Severe Storm Drain Silt Blockage at 5th Ave & Pine',
    rawDescription: 'The stormwater grating at 5th and Pine is completely packed with construction silt, gravel, and urban trash. Rainwater has no outlet and is backing up across the intersection.',
    aiSummary: 'Storm drain curb inlet obstructed by construction gravel and compacted debris, preventing drainage run-off.',
    category: 'water_drainage',
    aiValidatedCategory: 'water_drainage',
    address: '5th Ave & Pine St, Commercial Corridor',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7833, lng: -122.4167, xPercent: 54, yPercent: 48 },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Sarah Jenkins',
    citizenContact: 'sarah.j@downtownbiz.org',
    status: 'in_progress',
    priority: {
      totalScore: 84,
      level: 'high',
      severityScore: 28,
      vulnerabilityZoneScore: 20,
      publicImpactScore: 19,
      repeatEscalationScore: 17,
      explanation: 'High priority due to multi-report cluster trigger: clogged catch basin is primary root cause of intersection flooding and subsequent asphalt breakdown.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary report anchor for 5th Ave Infrastructure Cluster.'
    },
    clusterId: 'cluster-5th-pine',
    isHotspotSeed: true,
    assignedDepartment: 'Water Supply & Sewerage Board',
    assignedTo: 'Hydro-Vac Jetter Team 3',
    estimatedResolutionHours: 4,
    tags: ['drainage', 'storm-water', 'cluster-anchor', 'commercial-district'],
    timeline: [
      {
        id: 'tl-6',
        timestamp: '2026-10-29T21:00:00Z',
        title: 'Report Submitted',
        description: 'Filed by downtown business owner.',
        actor: 'Sarah Jenkins',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-7',
        timestamp: '2026-10-29T21:05:00Z',
        title: 'Cluster Correlated',
        description: 'AI correlated this report with CP-1052 (waterlogging) and CP-1058 (road cave-in) into Cluster #CL-01.',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'triaged'
      }
    ]
  },
  {
    id: 'rep-004',
    trackingCode: 'CP-1052',
    createdAt: '2026-10-29T22:20:00Z',
    updatedAt: '2026-10-30T03:00:00Z',
    title: 'Waterlogging 20cm deep trapping sedans at 5th Ave',
    rawDescription: 'Water is now 20cm deep across all lanes on 5th Ave corner. Small cars cannot pass, pedestrians wading through contaminated stormwater. Transit bus route 14 is stalled.',
    aiSummary: 'Extensive 20cm street waterlogging stranding vehicles and halting public transit line 14 at 5th Ave intersection.',
    category: 'water_drainage',
    aiValidatedCategory: 'water_drainage',
    address: '5th Ave & Pine St, Intersection',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7835, lng: -122.4165, xPercent: 54.5, yPercent: 48.2 },
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Transit Operator K. Singh',
    citizenContact: 'k.singh@metrotransit.org',
    status: 'in_progress',
    priority: {
      totalScore: 91,
      level: 'critical',
      severityScore: 32,
      vulnerabilityZoneScore: 22,
      publicImpactScore: 20,
      repeatEscalationScore: 17,
      explanation: 'Critical due to active disruption of public transit line 14 and vehicle stranding over 20cm contaminated water.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 35,
      reasoning: 'Related symptom to drain blockage CP-1050; grouped in Cluster #CL-01 rather than merged as duplicate.'
    },
    clusterId: 'cluster-5th-pine',
    assignedDepartment: 'Water Supply & Sewerage Board',
    assignedTo: 'Hydro-Vac Jetter Team 3 + Emergency Dewatering',
    estimatedResolutionHours: 3,
    tags: ['waterlogging', 'transit-stalled', 'cluster-5th-pine'],
    timeline: [
      {
        id: 'tl-8',
        timestamp: '2026-10-29T22:20:00Z',
        title: 'Report Submitted',
        description: 'Reported by municipal bus operator.',
        actor: 'Transit Operator K. Singh',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-005',
    trackingCode: 'CP-1060',
    createdAt: '2026-10-29T14:10:00Z',
    updatedAt: '2026-10-29T16:00:00Z',
    title: 'Overflowing commercial dumpsters behind Central Market',
    rawDescription: 'Three large commercial dumpsters behind Central Market alleyway are overflowing with decomposing organic vegetable and fish waste. Smells terrible, attracting swarms of flies and rodents.',
    aiSummary: 'Organic market food waste overflow attracting vermin and causing strong biological odor in downtown service alley.',
    category: 'waste_sanitation',
    aiValidatedCategory: 'waste_sanitation',
    address: 'Central Market Alleyway, Bay Street',
    zone: 'East Harbor District - Sector 1',
    coords: { lat: 37.7900, lng: -122.4000, xPercent: 78, yPercent: 26 },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Marco Bellini',
    citizenContact: 'marco@bellinicatering.com',
    status: 'triaged',
    priority: {
      totalScore: 74,
      level: 'high',
      severityScore: 24,
      vulnerabilityZoneScore: 16,
      publicImpactScore: 18,
      repeatEscalationScore: 16,
      explanation: 'High sanitation score due to biohazard decomposing waste and pest infestation near food handling facilities.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary report for Bay Street market dumpster issue.'
    },
    assignedDepartment: 'Municipal Sanitation & Waste Management',
    assignedTo: 'Heavy Compactor Route #7',
    tags: ['sanitation', 'biohazard', 'vermin', 'market'],
    timeline: [
      {
        id: 'tl-9',
        timestamp: '2026-10-29T14:10:00Z',
        title: 'Report Submitted',
        description: 'Reported by local caterer.',
        actor: 'Marco Bellini',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-006',
    trackingCode: 'CP-1063',
    createdAt: '2026-10-29T15:45:00Z',
    updatedAt: '2026-10-29T15:47:00Z',
    title: 'Huge rotting trash mountain in alley behind market',
    rawDescription: 'Horrible smell and garbage piled 6 feet high behind the market near Bay St. Rats running everywhere.',
    aiSummary: 'Severe bio-waste pile in alleyway behind market with active rodent infestation.',
    category: 'waste_sanitation',
    aiValidatedCategory: 'waste_sanitation',
    address: 'Behind Central Market, Bay St alley',
    zone: 'East Harbor District - Sector 1',
    coords: { lat: 37.7902, lng: -122.4002, xPercent: 78.2, yPercent: 26.3 },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Anita Thorne',
    citizenContact: 'anita.t@web.net',
    status: 'triaged',
    priority: {
      totalScore: 72,
      level: 'high',
      severityScore: 24,
      vulnerabilityZoneScore: 16,
      publicImpactScore: 16,
      repeatEscalationScore: 16,
      explanation: 'Marked as duplicate of CP-1060. Proximity 18 meters, identical issue description.'
    },
    duplicateInfo: {
      isDuplicate: true,
      parentReportId: 'rep-005',
      confidenceScore: 91,
      reasoning: '91% semantic match with CP-1060 (Central Market rotting trash). Automatically linked as duplicate to prevent double route assignment.',
      distanceMeters: 18
    },
    assignedDepartment: 'Municipal Sanitation & Waste Management',
    assignedTo: 'Heavy Compactor Route #7',
    tags: ['duplicate-merged', 'sanitation'],
    timeline: [
      {
        id: 'tl-10',
        timestamp: '2026-10-29T15:45:00Z',
        title: 'Report Submitted',
        description: 'Filed by citizen.',
        actor: 'Anita Thorne',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-11',
        timestamp: '2026-10-29T15:47:00Z',
        title: 'Duplicate Detected',
        description: 'Linked to primary ticket CP-1060.',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'triaged'
      }
    ]
  },
  {
    id: 'rep-007',
    trackingCode: 'CP-1058',
    createdAt: '2026-10-30T00:30:00Z',
    updatedAt: '2026-10-30T04:15:00Z',
    title: 'Asphalt collapse and subgrade cave-in on 5th Ave',
    rawDescription: 'The street pavement right next to the flooded drain at 5th and Pine has collapsed under the weight of traffic. A 1-meter wide cavity has opened up with water rushing underneath.',
    aiSummary: 'Structural road base failure creating a 1-meter sinkhole cavity exacerbated by standing floodwaters.',
    category: 'roads',
    aiValidatedCategory: 'roads',
    address: '5th Ave & Pine St, Roadway Lane 2',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7836, lng: -122.4168, xPercent: 54.3, yPercent: 48.6 },
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Officer Daniel Ross',
    citizenContact: 'd.ross@citypolice.gov',
    status: 'in_progress',
    priority: {
      totalScore: 96,
      level: 'critical',
      severityScore: 35,
      vulnerabilityZoneScore: 23,
      publicImpactScore: 20,
      repeatEscalationScore: 18,
      explanation: 'Critical 96/100 score: active asphalt collapse hazard with risk of vehicle entrapment. Part of 5th Ave multi-infrastructure cascade.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Critical structural cascade report in 5th Ave cluster.'
    },
    clusterId: 'cluster-5th-pine',
    assignedDepartment: 'Department of Public Works (Emergency Road Repair)',
    assignedTo: 'DPW Heavy Engineering Crew 1',
    estimatedResolutionHours: 8,
    tags: ['sinkhole', 'cave-in', 'cluster-5th-pine', 'critical-hazard'],
    timeline: [
      {
        id: 'tl-12',
        timestamp: '2026-10-30T00:30:00Z',
        title: 'Report Submitted',
        description: 'Emergency report by patrolling officer.',
        actor: 'Officer Daniel Ross',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-13',
        timestamp: '2026-10-30T00:32:00Z',
        title: 'Emergency Priority Escalation',
        description: 'AI detected structural cave-in + water saturation. Priority score 96.',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'triaged'
      }
    ]
  },
  {
    id: 'rep-008',
    trackingCode: 'CP-1070',
    createdAt: '2026-10-30T05:00:00Z',
    updatedAt: '2026-10-30T05:10:00Z',
    title: 'Downed live 440V power cable sparking near Metro North Entrance',
    rawDescription: 'A heavy overhead power line snapped during high winds and is currently lying across the wet sidewalk 15 meters from the Metro North main transit entrance. It is actively sparking and smoking.',
    aiSummary: 'Live 440V electrical conductor severed and actively sparking on wet sidewalk adjacent to high-traffic transit station.',
    category: 'electricity_lighting',
    aiValidatedCategory: 'electricity_lighting',
    address: 'Metro North Plaza, Station Approach Rd',
    zone: 'North Metro Hub - Sector 3',
    coords: { lat: 37.7950, lng: -122.4100, xPercent: 42, yPercent: 18 },
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Station Master T. Halloway',
    citizenContact: 't.halloway@metro.org',
    status: 'in_progress',
    priority: {
      totalScore: 99,
      level: 'critical',
      severityScore: 35,
      vulnerabilityZoneScore: 25,
      publicImpactScore: 20,
      repeatEscalationScore: 19,
      explanation: 'MAX CRITICALITY (99/100): Imminent electrocution hazard with wet conductive surface outside a major commuter subway entrance with 8,000+ hourly footfall.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary high-voltage emergency.'
    },
    assignedDepartment: 'Power & Grid Emergency Services',
    assignedTo: 'Lineworker Quick Response Unit #1',
    estimatedResolutionHours: 2,
    tags: ['electrocution-hazard', 'live-wire', 'subway-entrance', 'urgent-life-safety'],
    timeline: [
      {
        id: 'tl-14',
        timestamp: '2026-10-30T05:00:00Z',
        title: 'Urgent Life-Safety Alert Filed',
        description: 'Urgent hotline ping from Metro Station Master.',
        actor: 'Station Master T. Halloway',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-15',
        timestamp: '2026-10-30T05:02:00Z',
        title: 'Emergency Auto-Dispatch',
        description: 'AI triggered immediate Priority 99 protocol and pinged SCADA grid isolator.',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'in_progress'
      }
    ]
  },
  {
    id: 'rep-009',
    trackingCode: 'CP-1072',
    createdAt: '2026-10-30T05:08:00Z',
    updatedAt: '2026-10-30T05:10:00Z',
    title: 'Sparking wire on ground outside metro north entrance',
    rawDescription: 'Electrical wire sparking on the ground near metro entrance. People are screaming and running away.',
    aiSummary: 'Live sparking wire causing panic near metro station entrance.',
    category: 'electricity_lighting',
    aiValidatedCategory: 'electricity_lighting',
    address: 'Metro North Subway entrance sidewalk',
    zone: 'North Metro Hub - Sector 3',
    coords: { lat: 37.7951, lng: -122.4098, xPercent: 42.4, yPercent: 18.2 },
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Ravi Patel',
    citizenContact: 'ravi.p@mail.com',
    status: 'in_progress',
    priority: {
      totalScore: 98,
      level: 'critical',
      severityScore: 35,
      vulnerabilityZoneScore: 25,
      publicImpactScore: 20,
      repeatEscalationScore: 18,
      explanation: 'Linked as immediate duplicate of active emergency CP-1070. Coordinates match within 9 meters.'
    },
    duplicateInfo: {
      isDuplicate: true,
      parentReportId: 'rep-008',
      confidenceScore: 98,
      reasoning: '98% spatial and semantic match with CP-1070. Linked to prevent duplicate utility truck rollout while maintaining public alert log.',
      distanceMeters: 9
    },
    assignedDepartment: 'Power & Grid Emergency Services',
    assignedTo: 'Lineworker Quick Response Unit #1',
    tags: ['duplicate-merged', 'electrocution-hazard'],
    timeline: [
      {
        id: 'tl-16',
        timestamp: '2026-10-30T05:08:00Z',
        title: 'Report Submitted',
        description: 'Citizen report.',
        actor: 'Ravi Patel',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-17',
        timestamp: '2026-10-30T05:10:00Z',
        title: 'Duplicate Merged with CP-1070',
        description: 'Linked to primary ticket. Field crew already dispatched.',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'in_progress'
      }
    ]
  },
  {
    id: 'rep-010',
    trackingCode: 'CP-1080',
    createdAt: '2026-10-28T09:00:00Z',
    updatedAt: '2026-10-30T01:00:00Z',
    title: 'Streetlights out for 4 consecutive blocks on Westwood Blvd',
    rawDescription: 'All street lamps from 12th to 16th Street on Westwood Blvd have been completely blacked out for three nights. Neighborhood residents feel unsafe walking home from the bus stop.',
    aiSummary: 'Four-block lighting outage on major residential corridor creating pedestrian safety vulnerabilities.',
    category: 'electricity_lighting',
    aiValidatedCategory: 'electricity_lighting',
    address: 'Westwood Blvd between 12th and 16th St',
    zone: 'West Hills Residential - Sector 5',
    coords: { lat: 37.7650, lng: -122.4350, xPercent: 18, yPercent: 62 },
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Clara Oswald',
    citizenContact: 'clara.o@westhills.net',
    status: 'in_progress',
    priority: {
      totalScore: 68,
      level: 'medium',
      severityScore: 20,
      vulnerabilityZoneScore: 16,
      publicImpactScore: 16,
      repeatEscalationScore: 16,
      explanation: 'Medium-high score due to multi-block residential blackout and night-time pedestrian crime risk.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary report for Westwood corridor lighting failure.'
    },
    assignedDepartment: 'Street Lighting & Urban Electrical',
    assignedTo: 'Lighting Tech Unit 4',
    estimatedResolutionHours: 12,
    tags: ['streetlights', 'blackout', 'pedestrian-safety'],
    timeline: [
      {
        id: 'tl-18',
        timestamp: '2026-10-28T09:00:00Z',
        title: 'Report Submitted',
        description: 'Resident report.',
        actor: 'Clara Oswald',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-011',
    trackingCode: 'CP-1085',
    createdAt: '2026-10-29T11:20:00Z',
    updatedAt: '2026-10-30T04:00:00Z',
    title: 'Large fallen oak limb blocking eastbound lane of Oakridge Ave',
    rawDescription: 'A heavy 6-meter tree branch broke off during last night’s storm and fell directly across Oakridge Avenue. It completely blocks the eastbound lane and clipped an overhead telephone cable.',
    aiSummary: '6-meter fallen tree limb blocking one lane and snagging telecommunications line on Oakridge Ave.',
    category: 'parks_trees',
    aiValidatedCategory: 'parks_trees',
    address: '740 Oakridge Ave',
    zone: 'South Greenbelt - Sector 6',
    coords: { lat: 37.7550, lng: -122.4250, xPercent: 34, yPercent: 82 },
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Gregory House',
    citizenContact: 'g.house@health.org',
    status: 'triaged',
    priority: {
      totalScore: 78,
      level: 'high',
      severityScore: 26,
      vulnerabilityZoneScore: 17,
      publicImpactScore: 18,
      repeatEscalationScore: 17,
      explanation: 'High priority: lane blockage on transit avenue with entangled overhead low-voltage lines.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary fallen tree obstruction report.'
    },
    assignedDepartment: 'Urban Forestry & Parks Maintenance',
    assignedTo: 'Emergency Arborist Crew 2',
    estimatedResolutionHours: 4,
    tags: ['fallen-tree', 'obstruction', 'telecom-wire'],
    timeline: [
      {
        id: 'tl-19',
        timestamp: '2026-10-29T11:20:00Z',
        title: 'Report Submitted',
        description: 'Filed with photo of fallen oak.',
        actor: 'Gregory House',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-012',
    trackingCode: 'CP-1088',
    createdAt: '2026-10-29T12:05:00Z',
    updatedAt: '2026-10-29T12:07:00Z',
    title: 'Tree branch stuck on wire on Oakridge Avenue',
    rawDescription: 'Big branch broken and hanging on telephone wire over the road on Oakridge.',
    aiSummary: 'Fallen branch suspended on overhead utility cable over roadway.',
    category: 'parks_trees',
    aiValidatedCategory: 'parks_trees',
    address: '744 Oakridge Ave',
    zone: 'South Greenbelt - Sector 6',
    coords: { lat: 37.7552, lng: -122.4248, xPercent: 34.3, yPercent: 82.2 },
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Lisa Cuddy',
    citizenContact: 'lisa.c@clinic.org',
    status: 'triaged',
    priority: {
      totalScore: 76,
      level: 'high',
      severityScore: 26,
      vulnerabilityZoneScore: 17,
      publicImpactScore: 16,
      repeatEscalationScore: 17,
      explanation: 'Linked as duplicate of CP-1085 (distance 15m).'
    },
    duplicateInfo: {
      isDuplicate: true,
      parentReportId: 'rep-011',
      confidenceScore: 92,
      reasoning: '92% semantic and geographic match with CP-1085. Merged into primary work order for Arborist Crew 2.',
      distanceMeters: 15
    },
    assignedDepartment: 'Urban Forestry & Parks Maintenance',
    assignedTo: 'Emergency Arborist Crew 2',
    tags: ['duplicate-merged', 'fallen-tree'],
    timeline: [
      {
        id: 'tl-20',
        timestamp: '2026-10-29T12:05:00Z',
        title: 'Report Submitted',
        description: 'Citizen report.',
        actor: 'Lisa Cuddy',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-013',
    trackingCode: 'CP-1090',
    createdAt: '2026-10-27T08:00:00Z',
    updatedAt: '2026-10-29T17:00:00Z',
    title: 'Graffiti tagging on historical library wall',
    rawDescription: 'Extensive spray paint tags appeared on the sandstone facade of the Carnegie Public Library on Franklin St.',
    aiSummary: 'Spray paint vandalization on historic sandstone building exterior.',
    category: 'public_safety',
    aiValidatedCategory: 'public_safety',
    address: '300 Franklin St (Carnegie Library)',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7810, lng: -122.4210, xPercent: 49, yPercent: 52 },
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Arthur Dent',
    citizenContact: 'arthur.d@library.org',
    status: 'resolved',
    priority: {
      totalScore: 42,
      level: 'low',
      severityScore: 12,
      vulnerabilityZoneScore: 14,
      publicImpactScore: 10,
      repeatEscalationScore: 6,
      explanation: 'Low urgency cosmetic issue with zero physical danger to public safety.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Unique graffiti removal ticket.'
    },
    assignedDepartment: 'City Beautification & Historical Preservation',
    assignedTo: 'Graffiti Abatement Team B',
    estimatedResolutionHours: 24,
    tags: ['graffiti', 'cosmetic', 'resolved'],
    timeline: [
      {
        id: 'tl-21',
        timestamp: '2026-10-27T08:00:00Z',
        title: 'Report Submitted',
        description: 'Librarian report.',
        actor: 'Arthur Dent',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-22',
        timestamp: '2026-10-29T17:00:00Z',
        title: 'Chemical Stripping Complete',
        description: 'Eco-solvent restoration completed; protective anti-graffiti sealer applied.',
        actor: 'Graffiti Abatement Team B',
        actorRole: 'field_crew',
        statusChange: 'resolved'
      }
    ]
  },
  {
    id: 'rep-014',
    trackingCode: 'CP-1095',
    createdAt: '2026-10-30T06:00:00Z',
    updatedAt: '2026-10-30T06:10:00Z',
    title: 'Open unbarricaded manhole on pedestrian sidewalk by Children’s Park',
    rawDescription: 'Heavy iron manhole cover is missing or was stolen from the pedestrian walkway adjacent to the playground at Sunset Park. Deep drop of at least 3 meters straight into sewer culvert. Anyone walking in dusk could fall in.',
    aiSummary: 'Missing storm sewer cover creating a 3-meter fall trap immediately adjacent to active children playground.',
    category: 'public_safety',
    aiValidatedCategory: 'public_safety',
    address: 'Sunset Park, North Pedestrian Pathway (near swings)',
    zone: 'Sunset District - Sector 7',
    coords: { lat: 37.7600, lng: -122.4500, xPercent: 12, yPercent: 45 },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Maya Lin',
    citizenContact: 'maya.lin@parentcouncil.org',
    status: 'triaged',
    priority: {
      totalScore: 94,
      level: 'critical',
      severityScore: 34,
      vulnerabilityZoneScore: 24, // Playground zone
      publicImpactScore: 18,
      repeatEscalationScore: 18,
      explanation: 'Critical rating (94/100): Fatal fall hazard with 3m vertical drop directly adjoining playground perimeter.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary emergency safety report.'
    },
    assignedDepartment: 'Public Works & Sewer Maintenance',
    assignedTo: 'Safety Hazard Dispatch Unit 1',
    estimatedResolutionHours: 2,
    tags: ['open-manhole', 'fall-hazard', 'playground', 'critical-life-safety'],
    timeline: [
      {
        id: 'tl-23',
        timestamp: '2026-10-30T06:00:00Z',
        title: 'Report Submitted',
        description: 'Urgent mobile submission from parent at playground.',
        actor: 'Maya Lin',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-24',
        timestamp: '2026-10-30T06:05:00Z',
        title: 'Immediate Flagged by AI',
        description: 'High fall hazard recognized near child recreation facility. Marked Critical.',
        actor: 'CivicPulse AI Engine',
        actorRole: 'ai_system',
        statusChange: 'triaged'
      }
    ]
  },
  {
    id: 'rep-015',
    trackingCode: 'CP-1102',
    createdAt: '2026-10-29T10:15:00Z',
    updatedAt: '2026-10-29T14:30:00Z',
    title: 'Drinking water trunk line burst gushing onto Grand Ave',
    rawDescription: 'A pressurized 8-inch clean water municipal main ruptured beneath the sidewalk on Grand Ave. Water is shooting 2 meters into the air and eroding the curb foundation.',
    aiSummary: 'High-pressure clean water trunk main rupture causing pavement erosion and localized water pressure loss.',
    category: 'water_drainage',
    aiValidatedCategory: 'water_drainage',
    address: '1120 Grand Ave, near 9th Street',
    zone: 'East Harbor District - Sector 1',
    coords: { lat: 37.7880, lng: -122.4050, xPercent: 72, yPercent: 36 },
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Kenneth Branagh',
    citizenContact: 'k.b@theater.org',
    status: 'in_progress',
    priority: {
      totalScore: 90,
      level: 'critical',
      severityScore: 31,
      vulnerabilityZoneScore: 21,
      publicImpactScore: 20,
      repeatEscalationScore: 18,
      explanation: 'Critical rating: rapid loss of municipal treated water, foundation undermining, and pressure drop affecting nearby hospitals.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary water main rupture ticket.'
    },
    assignedDepartment: 'Water Distribution & Main Repair Squad',
    assignedTo: 'Emergency Water Distribution Technical Squad',
    estimatedResolutionHours: 4,
    tags: ['water-main-break', 'infrastructure-damage', 'water-loss'],
    timeline: [
      {
        id: 'tl-25',
        timestamp: '2026-10-29T10:15:00Z',
        title: 'Report Submitted',
        description: 'Resident report of geyser eruption.',
        actor: 'Kenneth Branagh',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-016',
    trackingCode: 'CP-1110',
    createdAt: '2026-10-29T16:20:00Z',
    updatedAt: '2026-10-29T18:00:00Z',
    title: 'Overflowing recycling bank spilling broken glass onto sidewalk',
    rawDescription: 'The neighborhood glass recycling depot bins on 8th Ave have not been emptied for 2 weeks. Bottles are smashed all over the pedestrian pavement.',
    aiSummary: 'Overfilled municipal glass recycling receptacles causing shattered glass safety hazard for pedestrians and pets.',
    category: 'waste_sanitation',
    aiValidatedCategory: 'waste_sanitation',
    address: '8th Ave & Lincoln Way',
    zone: 'Sunset District - Sector 7',
    coords: { lat: 37.7660, lng: -122.4600, xPercent: 10, yPercent: 55 },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Samira Khan',
    citizenContact: 'samira.k@community.net',
    status: 'triaged',
    priority: {
      totalScore: 65,
      level: 'medium',
      severityScore: 22,
      vulnerabilityZoneScore: 14,
      publicImpactScore: 15,
      repeatEscalationScore: 14,
      explanation: 'Medium priority: broken glass poses injury hazard to dog walkers and pedestrians.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary recycling overflow ticket.'
    },
    assignedDepartment: 'Municipal Sanitation & Waste Management',
    assignedTo: 'Recycling Collection Truck #12',
    estimatedResolutionHours: 18,
    tags: ['recycling', 'broken-glass', 'pedestrian-injury-risk'],
    timeline: [
      {
        id: 'tl-26',
        timestamp: '2026-10-29T16:20:00Z',
        title: 'Report Submitted',
        description: 'Filed by neighborhood association chair.',
        actor: 'Samira Khan',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-017',
    trackingCode: 'CP-1115',
    createdAt: '2026-10-28T14:00:00Z',
    updatedAt: '2026-10-29T16:30:00Z',
    title: 'Pedestrian countdown signal stuck on Red at Broad St crossing',
    rawDescription: 'The pedestrian crossing push-button and walk countdown signal at Broad St & 3rd St is frozen on solid red. Pedestrians are blindly darting across 4 lanes of fast traffic.',
    aiSummary: 'Crosswalk pedestrian signal malfunction stuck on don’t walk phase forcing risky mid-block crossing.',
    category: 'public_safety',
    aiValidatedCategory: 'public_safety',
    address: 'Broad St & 3rd St Intersection',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7850, lng: -122.4120, xPercent: 58, yPercent: 44 },
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Devon Ward',
    citizenContact: 'devon.w@commuter.com',
    status: 'in_progress',
    priority: {
      totalScore: 82,
      level: 'high',
      severityScore: 28,
      vulnerabilityZoneScore: 20,
      publicImpactScore: 18,
      repeatEscalationScore: 16,
      explanation: 'High priority due to pedestrian collision exposure across busy multi-lane downtown arterial.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary traffic controller malfunction ticket.'
    },
    assignedDepartment: 'Department of Transportation (Traffic Signals)',
    assignedTo: 'Signal Electronics Unit 2',
    estimatedResolutionHours: 6,
    tags: ['traffic-light', 'crosswalk', 'pedestrian-safety'],
    timeline: [
      {
        id: 'tl-27',
        timestamp: '2026-10-28T14:00:00Z',
        title: 'Report Submitted',
        description: 'Reported by downtown commuter.',
        actor: 'Devon Ward',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-018',
    trackingCode: 'CP-1120',
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-29T11:00:00Z',
    title: 'Playground swing set chains broken and unfastened',
    rawDescription: 'Two swing seats at Maple Park playground have broken carabiner shackles and sharp exposed rusted chain links hanging down.',
    aiSummary: 'Damaged playground swings with fractured chain links and exposed metal burrs.',
    category: 'parks_trees',
    aiValidatedCategory: 'parks_trees',
    address: 'Maple Park Play Area, Sector 5',
    zone: 'West Hills Residential - Sector 5',
    coords: { lat: 37.7680, lng: -122.4380, xPercent: 22, yPercent: 68 },
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Hannah Morales',
    citizenContact: 'hannah.m@email.org',
    status: 'resolved',
    priority: {
      totalScore: 54,
      level: 'medium',
      severityScore: 18,
      vulnerabilityZoneScore: 20,
      publicImpactScore: 10,
      repeatEscalationScore: 6,
      explanation: 'Moderate severity with high child-zone sensitivity. Repaired within 24h.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Playground repair ticket.'
    },
    assignedDepartment: 'Parks & Recreation Facilities Maintenance',
    assignedTo: 'Parks Service Crew C',
    estimatedResolutionHours: 24,
    tags: ['playground', 'parks', 'resolved'],
    timeline: [
      {
        id: 'tl-28',
        timestamp: '2026-10-28T10:00:00Z',
        title: 'Report Submitted',
        description: 'Parent notification.',
        actor: 'Hannah Morales',
        actorRole: 'citizen',
        statusChange: 'pending'
      },
      {
        id: 'tl-29',
        timestamp: '2026-10-29T11:00:00Z',
        title: 'Shackles & Chains Replaced',
        description: 'Installed new heavy-duty stainless safety shackles and rubberized chains.',
        actor: 'Parks Service Crew C',
        actorRole: 'field_crew',
        statusChange: 'resolved'
      }
    ]
  },
  {
    id: 'rep-019',
    trackingCode: 'CP-1055',
    createdAt: '2026-10-29T23:45:00Z',
    updatedAt: '2026-10-30T01:30:00Z',
    title: 'Trash and leaf sludge blocking curb grating at 5th Ave pedestrian crossing',
    rawDescription: 'The entire curb return is flooded because restaurant refuse sacks were washed into the sewer grating on 5th Ave.',
    aiSummary: 'Curb storm grating blocked by restaurant solid waste exacerbating intersection flooding.',
    category: 'water_drainage',
    aiValidatedCategory: 'water_drainage',
    address: '5th Ave & Pine St, Southwest Corner',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7834, lng: -122.4166, xPercent: 54.2, yPercent: 48.4 },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Carlos Rivera',
    citizenContact: 'c.rivera@market.com',
    status: 'in_progress',
    priority: {
      totalScore: 86,
      level: 'high',
      severityScore: 27,
      vulnerabilityZoneScore: 21,
      publicImpactScore: 20,
      repeatEscalationScore: 18,
      explanation: 'Third critical incident in 5th Ave Infrastructure Cluster. Escalated to Sewerage Board emergency response.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 40,
      reasoning: 'Related component in Cluster #CL-01.'
    },
    clusterId: 'cluster-5th-pine',
    assignedDepartment: 'Water Supply & Sewerage Board',
    assignedTo: 'Hydro-Vac Jetter Team 3',
    tags: ['cluster-5th-pine', 'drainage', 'commercial'],
    timeline: [
      {
        id: 'tl-30',
        timestamp: '2026-10-29T23:45:00Z',
        title: 'Report Submitted',
        description: 'Corner shop worker report.',
        actor: 'Carlos Rivera',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  },
  {
    id: 'rep-020',
    trackingCode: 'CP-1130',
    createdAt: '2026-10-30T04:30:00Z',
    updatedAt: '2026-10-30T05:00:00Z',
    title: 'Missing stop sign knocked down at 4-way intersection 7th & Market',
    rawDescription: 'A delivery van hit the stop sign at 7th and Market and drove off. The sign is completely sheared off at the concrete base. Cars are speeding straight through without stopping, causing near misses.',
    aiSummary: 'Sheared stop sign at high-volume 4-way intersection creating imminent multi-vehicle collision risk.',
    category: 'public_safety',
    aiValidatedCategory: 'public_safety',
    address: '7th St & Market St',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7800, lng: -122.4140, xPercent: 52, yPercent: 50 },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    citizenName: 'Officer Bradley Cooper',
    citizenContact: 'b.cooper@trafficpolice.gov',
    status: 'triaged',
    priority: {
      totalScore: 93,
      level: 'critical',
      severityScore: 33,
      vulnerabilityZoneScore: 24,
      publicImpactScore: 19,
      repeatEscalationScore: 17,
      explanation: 'Critical rating (93/100): Missing regulatory stop sign at busy 4-way junction generates extreme broadside collision danger.'
    },
    duplicateInfo: {
      isDuplicate: false,
      confidenceScore: 0,
      reasoning: 'Primary traffic sign collision report.'
    },
    assignedDepartment: 'Department of Transportation (Signage & Safety)',
    assignedTo: 'Rapid Sign Installation Crew',
    estimatedResolutionHours: 3,
    tags: ['missing-sign', 'stop-sign', 'collision-risk', 'critical'],
    timeline: [
      {
        id: 'tl-31',
        timestamp: '2026-10-30T04:30:00Z',
        title: 'Report Submitted',
        description: 'Traffic officer report.',
        actor: 'Officer Bradley Cooper',
        actorRole: 'citizen',
        statusChange: 'pending'
      }
    ]
  }
];

export const INITIAL_CLUSTERS = [
  {
    id: 'cluster-5th-pine',
    name: '5th Ave & Pine St Infrastructure Cascade',
    zone: 'Central Business District - Sector 4',
    categoryPrimary: 'water_drainage' as const,
    reportCount: 4,
    reportIds: ['rep-003', 'rep-004', 'rep-007', 'rep-019'],
    centroid: { lat: 37.7834, lng: -122.4167, xPercent: 54.2, yPercent: 48.3 },
    severityLevel: 'critical' as const,
    rootCauseAnalysis: 'Siltation of underground stormwater catch basin led to 20cm surface flooding, which subsequently saturated the road base subgrade, causing severe asphalt collapse and sinkhole formation.',
    infrastructureCascadeRisk: 'Compounded failure: drainage failure -> transit route 14 stoppage -> structural asphalt collapse under heavy bus axle loads.',
    recommendedDepartment: 'Joint Taskforce: Sewerage Board + DPW Heavy Road Engineering'
  },
  {
    id: 'cluster-elm-school',
    name: 'Elm Street School Transit Corridor Hazard Zone',
    zone: 'North Ward - Sector 2',
    categoryPrimary: 'roads' as const,
    reportCount: 2,
    reportIds: ['rep-001', 'rep-002'],
    centroid: { lat: 37.7750, lng: -122.4193, xPercent: 28.2, yPercent: 32.2 },
    severityLevel: 'critical' as const,
    rootCauseAnalysis: 'Repeated heavy school bus turning radius combined with subterranean utility water seepage fractured asphalt at crosswalk threshold.',
    infrastructureCascadeRisk: 'High vulnerability to vulnerable child pedestrians and bus tire blowouts during 07:30 - 08:45 AM peak window.',
    recommendedDepartment: 'Department of Public Works (Roads)'
  },
  {
    id: 'cluster-market-sanitation',
    name: 'Bay Street Central Market Commercial Waste Hotspot',
    zone: 'East Harbor District - Sector 1',
    categoryPrimary: 'waste_sanitation' as const,
    reportCount: 2,
    reportIds: ['rep-005', 'rep-006'],
    centroid: { lat: 37.7901, lng: -122.4001, xPercent: 78.1, yPercent: 26.1 },
    severityLevel: 'high' as const,
    rootCauseAnalysis: 'Inadequate commercial dumpster capacity for 30+ weekend seafood and produce vendors, resulting in chronic alleyway spillage.',
    infrastructureCascadeRisk: 'Vector infestation (rodents, flies) threatening food safety licenses of adjoining restaurants.',
    recommendedDepartment: 'Municipal Sanitation & Waste Management'
  }
];
