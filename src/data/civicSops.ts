import { CivicSOP } from '../types/civic';

export const CIVIC_SOPS: CivicSOP[] = [
  {
    id: 'sop-1',
    code: 'SOP-ROAD-01',
    category: 'roads',
    title: 'Severe Arterial Pothole & Road Subsidence Rapid Remediation',
    targetHazard: 'Potholes > 10cm depth, cave-ins on transit routes, asphalt fractures',
    standardTurnaroundHours: 12,
    crewType: 'Asphalt Rapid Response Unit (3-4 workers)',
    requiredEquipment: [
      'Cold/Warm asphalt batch truck',
      'Plate compactor & vibratory roller',
      'Reflective high-visibility traffic cones & directional arrow board',
      'Pavement cold planer / jackhammer',
      'Bituminous tack coat emulsion'
    ],
    safetyProtocols: [
      'Deploy 50m taper warning buffer with Type II flashing barricades',
      'Divert bicycle/two-wheeler lanes prior to excavation',
      'Check for shallow underground fiber or municipal utility conduit tags before deep compaction'
    ],
    stepByStepAction: [
      '1. Zone isolation: Erect barricades and reroute one traffic lane with certified flagger.',
      '2. Clean & square edges: Chisel vertical rectangular edges around damaged depression to ensure mechanical keying.',
      '3. Moisture removal: Blow out standing debris and dry cavity using industrial hot-air lance.',
      '4. Prime coat: Spray bituminous binder emulsion along base and perimeter walls.',
      '5. Aggregate fill: Place high-performance polymer asphalt in 50mm compacted lifts.',
      '6. Compaction: Execute minimum 4 passes with vibratory plate compactor to 95% standard density.',
      '7. Sealing & Opening: Apply sand seal along joint line to prevent water intrusion; open to low-speed traffic in 45 mins.'
    ]
  },
  {
    id: 'sop-2',
    code: 'SOP-WATER-04',
    category: 'water_drainage',
    title: 'Stormwater Culvert Blockage, Silt Hydro-Jetting & Dewatering Protocol',
    targetHazard: 'Culvert siltation, urban street inundation > 15cm, catch basin backup',
    standardTurnaroundHours: 6,
    crewType: 'Municipal Hydro-Vac & Dewatering Squad (3 workers)',
    requiredEquipment: [
      'High-pressure combo jetter / vacuum suction tanker',
      '3-inch trash pump with 30m discharge hoses',
      'Confined space gas detector (4-gas monitor: O2, H2S, CO, LEL)',
      'Hydraulic root-cutting spinner nozzle',
      'Silt trap filtration socks'
    ],
    safetyProtocols: [
      'Never enter subterranean catch basins without continuous gas monitoring and retrieval harness',
      'Verify discharge water does not flood private residential basements or power substations',
      'Place sediment containment boom at downstream drainage outfall'
    ],
    stepByStepAction: [
      '1. Depth assessment: Measure flood depth and identify intake inlet and downstream manhole.',
      '2. Immediate dewatering: Position submersible trash pump to relieve standing street water towards secondary retention basin.',
      '3. High-pressure jetting: Feed rotating jetter hose upstream against water flow at 2,000 PSI to break solid sludge plugs.',
      '4. Slurry extraction: Vacuum liquified silt and trapped solid refuse directly into tank chamber.',
      '5. Flow verification: Drop fluorescent tracing dye into upstream curb intake to confirm unimpeded velocity.',
      '6. Grate refurbishment: Clean and bolt heavy-duty iron storm grate back into anchored seat.'
    ]
  },
  {
    id: 'sop-3',
    code: 'SOP-WATER-09',
    category: 'water_drainage',
    title: 'Drinking Water Trunk Line Burst & Soil Erosion Containment',
    targetHazard: 'Pressurized main rupture, geyser eruption, road foundation wash-out',
    standardTurnaroundHours: 4,
    crewType: 'Emergency Water Distribution Technical Squad (4-5 engineers)',
    requiredEquipment: [
      'Gate valve T-keys for primary trunk isolation',
      'Mini excavator with rubber tracks',
      'Stainless steel repair clamp sleeve (6-inch to 12-inch diameter)',
      'Chlorine residual test kit & disinfectant tablet dosing unit',
      'Acoustic leak correlator'
    ],
    safetyProtocols: [
      'Immediately coordinate with Power Utility to ensure no live underground cables in waterlogged soil',
      'Issue local boil-water precautionary advisory to adjacent neighborhood wards',
      'Shore trench walls if excavation exceeds 1.2m depth'
    ],
    stepByStepAction: [
      '1. Sector isolation: Turn off quadrant isolation valves upstream and downstream to halt flow while maintaining emergency fire hydrants.',
      '2. Excavation & shoring: Carefully excavate trench box around ruptured pipe section.',
      '3. Pipe preparation: Wire-brush external pipe corrosion and measure exact wall diameter.',
      '4. Sleeve installation: Torque stainless steel full-circle repair clamp to 75 ft-lbs.',
      '5. Disinfection: Flush section with 50ppm hyperchlorinated water and test for zero bacterial backflow.',
      '6. Pressure recharging: Slow recharge of line to prevent hydraulic water hammer shockwaves.'
    ]
  },
  {
    id: 'sop-4',
    code: 'SOP-ELEC-02',
    category: 'electricity_lighting',
    title: 'Downed Live Electrical Conductor & High-Voltage Pole Hazard Mitigation',
    targetHazard: 'Exposed energized wires, sparking transformers, vehicle collision with lighting pole',
    standardTurnaroundHours: 2,
    crewType: 'Emergency Lineman & Grid Safety Unit (2 certified lineworkers)',
    requiredEquipment: [
      'Insulated bucket truck (46kV rated)',
      'High-voltage fiberglass hot sticks and rubber insulating gloves (Class 4)',
      'Non-contact voltage detector wand',
      'Temporary grounding clamps and bonding cables',
      'Cable splice kit & replacement cross-arms'
    ],
    safetyProtocols: [
      'CRITICAL: Maintain minimum 10-meter perimeter cordon until zero-potential confirmed',
      'Treat all downed conductors as live until mechanically grounded on both sides',
      'Clear crowds, pedestrians, and metallic vehicles immediately'
    ],
    stepByStepAction: [
      '1. Emergency cordon: Police/marshal exclusion zone setup around conductive wet surfaces.',
      '2. Remote grid trip: Request SCADA dispatcher to lock out and tag out feeder breaker #F-14.',
      '3. Visual & field testing: Test wire with proximity audio/visual voltage detector.',
      '4. Grounding: Attach protective grounds to dissipate any residual or induced capacitance.',
      '5. Splice / De-energize: Cut damaged section, elevate line onto pole insulator, or terminate cleanly into subterranean junction box.',
      '6. Circuit validation: Remove grounds, test insulation resistance, and restore power feeder safely.'
    ]
  },
  {
    id: 'sop-5',
    code: 'SOP-WASTE-03',
    category: 'waste_sanitation',
    title: 'Illegal Community Dumpsite & Hazardous Bio-Refuse Abatement',
    targetHazard: 'Overflowing dumpsters > 5 days, biological vector infestation, road encroachment',
    standardTurnaroundHours: 18,
    crewType: 'Sanitation Heavy Clearance Squad (4 workers)',
    requiredEquipment: [
      'Rear-loader automated municipal compactor truck',
      'Skid-steer loader with grapple bucket',
      'Bio-enzyme deodorizing and disinfectant spray rig',
      'PPE (respiratory half-masks, puncture-resistant nitrile gloves, safety goggles)'
    ],
    safetyProtocols: [
      'Separate medical/hazardous items into red biohazard drums',
      'Check for rodent or venomous pest infestation before mechanical grabbing',
      'Do not burn any trash under any circumstances'
    ],
    stepByStepAction: [
      '1. Site demarcation: Cone off loading zone on street.',
      '2. Bulk mechanical clearing: Skid-steer collects heavy refuse piles into rear loader hopper.',
      '3. Hand sweep & salvage: Crews rake residual glass, plastic, and fine contaminants.',
      '4. Disinfection: Power wash pavement with biodegradable surfactant and citrus bio-sanitizer.',
      '5. Public deterrence: Install municipal surveillance warning placard and position two 1,100L lockable wheelie bins.'
    ]
  },
  {
    id: 'sop-6',
    code: 'SOP-TREE-05',
    category: 'parks_trees',
    title: 'Fallen Tree Roadway Obstruction & Overhead Canopy Clearing',
    targetHazard: 'Fallen trunk blocking roadway, split branches resting on overhead wires',
    standardTurnaroundHours: 4,
    crewType: 'Urban Forestry Emergency Arborist Crew (3 members)',
    requiredEquipment: [
      'Commercial chainsaws (20-inch and 28-inch guide bars)',
      'Heavy wood chipper with hydraulic feed roller',
      'Winch truck with synthetic kinetic snatch strap',
      'Arborist rigging ropes, pulleys, and friction bollard'
    ],
    safetyProtocols: [
      'Inspect for overhead electric lines before cutting; if wires touched, wait for Power Utility clearance',
      'Calculate trunk tension and compression sides before cutting to prevent chainsaw binding and violent kickback',
      'Hard hats, mesh face shields, and Kevlar chainsaw chaps mandatory'
    ],
    stepByStepAction: [
      '1. Hazard clearance: Verify tree is not energized by contacting street wires.',
      '2. Delimbing: Cut outer foliage and lateral limbs, feeding branches into roadside wood chipper.',
      '3. Bucking the main trunk: Saw the central bole into manageable 0.8-meter logs using wedge relief cuts.',
      '4. Roadway winching: Pull residual root ball or trunk off roadway with truck winch.',
      '5. Debris sweep: Industrial blower removes chips and leaf scatter from bike lanes and drains.'
    ]
  }
];
