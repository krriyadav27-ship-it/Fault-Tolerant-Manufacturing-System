export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@pharmapulse.gmp',
    role: 'Admin',
    title: 'Director of QA & System Validation',
    badgeId: 'QA-8821',
    cleanroomGrade: 'Grade A / ISO 5 Qualified',
    pin: '9901',
    avatar: 'SC'
  },
  {
    id: 'USR-002',
    name: 'Marcus Vance',
    email: 'm.vance@pharmapulse.gmp',
    role: 'Operator',
    title: 'Senior Cleanroom Lead Operator',
    badgeId: 'OP-4412',
    cleanroomGrade: 'Grade B / ISO 6 Qualified',
    pin: '4412',
    avatar: 'MV'
  },
  {
    id: 'USR-003',
    name: 'Elena Rostova',
    email: 'e.rostova@pharmapulse.gmp',
    role: 'Operator',
    title: 'Formulation Process Technician',
    badgeId: 'OP-2203',
    cleanroomGrade: 'Grade B / ISO 6 Qualified',
    pin: '2203',
    avatar: 'ER'
  }
];

export const INITIAL_LIMITS = {
  temperature: {
    name: 'Core Reaction Temperature',
    unit: '°C',
    setpoint: 22.0,
    normalMin: 20.0,
    normalMax: 24.0,
    warningLow: 18.5,
    warningHigh: 25.5,
    criticalLow: 17.0,
    criticalHigh: 27.0,
    driftTolerance: 0.8 // Max delta between redundant sensors
  },
  pressure: {
    name: 'Differential Room Overpressure',
    unit: 'Pa',
    setpoint: 42.0,
    normalMin: 32.0,
    normalMax: 52.0,
    warningLow: 25.0,
    warningHigh: 60.0,
    criticalLow: 18.0,
    criticalHigh: 72.0
  },
  flowRate: {
    name: 'WFI (Water For Injection) Flow',
    unit: 'L/min',
    setpoint: 15.0,
    normalMin: 12.0,
    normalMax: 18.0,
    warningLow: 9.5,
    warningHigh: 20.5,
    criticalLow: 7.0,
    criticalHigh: 23.0
  }
};

export const INITIAL_BATCH = {
  id: 'BATCH-2026-VAC-098',
  productName: 'Amoxicillin Sterile Suspension 250mg/5mL',
  stage: 'Aseptic Filling & Thermal Stabilization',
  line: 'Cleanroom Suite 1 - Reactor 101-A',
  startedAt: '2026-11-16 06:00:00',
  targetVolume: '2,500 Liters',
  status: 'In Progress (Active Monitoring)',
  complianceGrade: 'cGMP Class A / 21 CFR Part 11 Active'
};

export const PRODUCTION_LINES = [
  'Cleanroom Suite 1 - Reactor 101-A',
  'Cleanroom Suite 2 - Formulation Tank B',
  'Lyophilization Suite 3 - Freeze Dryer L-04',
  'Sterile Filling Line 4 - Isolator C'
];

export const SHIFTS = [
  { id: 'shift-a', name: 'Shift A (Morning 06:00 - 14:00)' },
  { id: 'shift-b', name: 'Shift B (Afternoon 14:00 - 22:00)' },
  { id: 'shift-c', name: 'Shift C (Night 22:00 - 06:00)' }
];

export const INITIAL_STOCK = [
  {
    id: 'STK-001',
    code: 'API-AMOX-01',
    name: 'Amoxicillin Trihydrate Micronized (API)',
    category: 'Active Pharmaceutical Ingredient',
    lotNumber: 'LOT-AMX-2026-08',
    quantity: 420.5,
    minThreshold: 150.0,
    unit: 'kg',
    storageCondition: '15°C - 25°C (Controlled Room Temp)',
    expiryDate: '2027-08-15',
    supplier: 'BioPure Pharma Ingredients Ltd.',
    status: 'Adequate'
  },
  {
    id: 'STK-002',
    code: 'EXC-SUCR-04',
    name: 'Pharma-Grade Sucrose Excipient (NF/EP)',
    category: 'Excipient',
    lotNumber: 'LOT-SUC-2026-21',
    quantity: 85.0,
    minThreshold: 100.0,
    unit: 'kg',
    storageCondition: '15°C - 25°C (Dry Storage)',
    expiryDate: '2026-12-05', // Expiring very soon!
    supplier: 'Apex BioChem Global',
    status: 'Low Stock'
  },
  {
    id: 'STK-003',
    code: 'BUF-HEPES-11',
    name: 'Sterile HEPES Buffer Solution 1M (pH 7.4)',
    category: 'Buffer / Reagent',
    lotNumber: 'LOT-HEP-2025-99',
    quantity: 12.0,
    minThreshold: 40.0,
    unit: 'Liters',
    storageCondition: '2°C - 8°C (Cold Chain Required)',
    expiryDate: '2026-11-20', // Expiring in 4 days!
    supplier: 'CryoSafe Biologicals',
    status: 'Expiring Soon'
  },
  {
    id: 'STK-004',
    code: 'WFI-USP-01',
    name: 'Water for Injection Bulk Reserve (USP/EP)',
    category: 'Solvent / Diluent',
    lotNumber: 'WFI-CIRC-TANK-01',
    quantity: 4850.0,
    minThreshold: 2000.0,
    unit: 'Liters',
    storageCondition: 'Continuous Recirculation 80°C loop',
    expiryDate: '2027-01-01',
    supplier: 'On-site WFI Multi-effect Still',
    status: 'Adequate'
  },
  {
    id: 'STK-005',
    code: 'MAT-VIAL-20M',
    name: 'Type 1 Borosilicate Amber Vials 20mL',
    category: 'Primary Packaging',
    lotNumber: 'LOT-VIAL-9932',
    quantity: 18400,
    minThreshold: 5000,
    unit: 'Units',
    storageCondition: 'Ambient Cleanroom Warehouse',
    expiryDate: '2029-10-30',
    supplier: 'Schott Pharma Packaging',
    status: 'Adequate'
  },
  {
    id: 'STK-006',
    code: 'REA-LIMUL-02',
    name: 'LAL Endotoxin Pyrogen Testing Reagent',
    category: 'Quality Control Assay',
    lotNumber: 'LOT-LAL-2026-03',
    quantity: 4.0,
    minThreshold: 10.0,
    unit: 'Kits',
    storageCondition: '-20°C (Ultra-Cold Storage)',
    expiryDate: '2026-11-10', // Already expired!
    supplier: 'EndoSafe Testing Systems',
    status: 'Expired'
  },
  {
    id: 'STK-007',
    code: 'DIS-IPA-70',
    name: 'Sterile 70% Isopropanol (VHP Resistant)',
    category: 'Cleanroom Sanitizer',
    lotNumber: 'LOT-IPA-4410',
    quantity: 340.0,
    minThreshold: 80.0,
    unit: 'Liters',
    storageCondition: 'Flammables Safety Cabinet',
    expiryDate: '2027-04-12',
    supplier: 'Ecolab Life Sciences',
    status: 'Adequate'
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-1092',
    timestamp: '2026-11-16 21:52:10',
    type: 'Stock',
    severity: 'Critical',
    title: 'QC Reagent Expired in Storage',
    message: 'LAL Endotoxin Pyrogen Testing Reagent (Lot LOT-LAL-2026-03) passed expiry date on 2026-11-10. Immediate quarantine mandated.',
    source: 'Warehouse Inventory Subsystem',
    status: 'Active',
    acknowledgedBy: null,
    resolution: null
  },
  {
    id: 'ALT-1091',
    timestamp: '2026-11-16 21:40:05',
    type: 'Stock',
    severity: 'Warning',
    title: 'Cold-Chain Buffer Expiring in 4 Days',
    message: 'Sterile HEPES Buffer Solution (Lot LOT-HEP-2025-99) expires on 2026-11-20. Current stock: 12.0 L (below safety threshold of 40 L).',
    source: 'Stock Control Manager',
    status: 'Active',
    acknowledgedBy: null,
    resolution: null
  },
  {
    id: 'ALT-1089',
    timestamp: '2026-11-16 20:15:22',
    type: 'Temperature',
    severity: 'Warning',
    title: 'Sensor B Micro-Drift Detected & Mitigated',
    message: 'Fault tolerance TMR engine detected PT-100 Beta drifted +0.65°C from consensus. Sensor B isolated by quorum voting without batch deviation.',
    source: 'TMR Fault-Tolerant Controller',
    status: 'Acknowledged',
    acknowledgedBy: 'Marcus Vance (OP-4412)',
    resolution: 'Sensor B scheduled for calibration re-verification at next CIP cycle.'
  },
  {
    id: 'ALT-1085',
    timestamp: '2026-11-16 18:22:14',
    type: 'Process',
    severity: 'Warning',
    title: 'Differential Pressure Transient Drop',
    message: 'Airlock door transfer cycle caused momentary differential pressure drop to 28.4 Pa (Warning band). Restored to 41.2 Pa in 18s.',
    source: 'HVAC Cleanroom Delta-P Monitor',
    status: 'Resolved',
    acknowledgedBy: 'Dr. Sarah Chen (QA-8821)',
    resolution: 'Normal interlock door cycling verified. No cleanroom integrity breach.'
  }
];

export const INITIAL_READINGS_HISTORY = [
  { id: 'RDG-101', timestamp: '2026-11-16 14:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 21.8, tempB: 21.9, tempC: 21.7, consensusTemp: 21.8, pressure: 42.1, flowRate: 15.2, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-102', timestamp: '2026-11-16 14:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 21.9, tempB: 22.0, tempC: 21.9, consensusTemp: 21.9, pressure: 42.4, flowRate: 15.1, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-103', timestamp: '2026-11-16 15:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 22.1, tempB: 22.1, tempC: 22.0, consensusTemp: 22.1, pressure: 41.8, flowRate: 15.3, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-104', timestamp: '2026-11-16 15:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 22.3, tempB: 22.4, tempC: 22.2, consensusTemp: 22.3, pressure: 43.0, flowRate: 14.9, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-105', timestamp: '2026-11-16 16:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 22.5, tempB: 22.5, tempC: 22.4, consensusTemp: 22.5, pressure: 42.6, flowRate: 15.0, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-106', timestamp: '2026-11-16 16:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 22.7, tempB: 22.8, tempC: 22.6, consensusTemp: 22.7, pressure: 42.0, flowRate: 15.4, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-107', timestamp: '2026-11-16 17:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 23.0, tempB: 23.1, tempC: 22.9, consensusTemp: 23.0, pressure: 41.5, flowRate: 15.2, status: 'Normal', operator: 'Elena Rostova' },
  { id: 'RDG-108', timestamp: '2026-11-16 17:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 23.4, tempB: 23.5, tempC: 23.3, consensusTemp: 23.4, pressure: 40.9, flowRate: 14.8, status: 'Normal', operator: 'Elena Rostova' },
  { id: 'RDG-109', timestamp: '2026-11-16 18:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 24.2, tempB: 24.3, tempC: 24.1, consensusTemp: 24.2, pressure: 28.4, flowRate: 14.5, status: 'Warning', operator: 'Elena Rostova' },
  { id: 'RDG-110', timestamp: '2026-11-16 18:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 23.8, tempB: 23.9, tempC: 23.7, consensusTemp: 23.8, pressure: 41.2, flowRate: 15.0, status: 'Normal', operator: 'Elena Rostova' },
  { id: 'RDG-111', timestamp: '2026-11-16 19:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 23.1, tempB: 23.2, tempC: 23.0, consensusTemp: 23.1, pressure: 42.8, flowRate: 15.5, status: 'Normal', operator: 'Elena Rostova' },
  { id: 'RDG-112', timestamp: '2026-11-16 19:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 22.4, tempB: 22.5, tempC: 22.3, consensusTemp: 22.4, pressure: 43.1, flowRate: 15.2, status: 'Normal', operator: 'Elena Rostova' },
  { id: 'RDG-113', timestamp: '2026-11-16 20:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 22.0, tempB: 22.7, tempC: 22.1, consensusTemp: 22.05, pressure: 42.5, flowRate: 15.1, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-114', timestamp: '2026-11-16 20:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 21.9, tempB: 22.6, tempC: 21.8, consensusTemp: 21.85, pressure: 42.3, flowRate: 14.9, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-115', timestamp: '2026-11-16 21:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 21.7, tempB: 21.8, tempC: 21.6, consensusTemp: 21.7, pressure: 42.0, flowRate: 15.3, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-116', timestamp: '2026-11-16 21:30', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 21.5, tempB: 21.6, tempC: 21.5, consensusTemp: 21.5, pressure: 42.4, flowRate: 15.4, status: 'Normal', operator: 'Marcus Vance' },
  { id: 'RDG-117', timestamp: '2026-11-16 22:00', batchId: 'BATCH-2026-VAC-098', line: 'Cleanroom Suite 1 - Reactor 101-A', tempA: 21.4, tempB: 21.5, tempC: 21.3, consensusTemp: 21.4, pressure: 42.2, flowRate: 15.3, status: 'Normal', operator: 'Marcus Vance' }
];

export const INITIAL_SHIFT_LOGS = [
  {
    id: 'SFT-2026-11-16-A',
    date: '2026-11-16',
    shift: 'Shift A (Morning 06:00 - 14:00)',
    leadOperator: 'Marcus Vance (OP-4412)',
    readingsLogged: 16,
    meanTemp: '22.1°C',
    meanPressure: '42.2 Pa',
    deviationsCount: 0,
    handoverSummary: 'Batch 098 started smoothly. Cooling jacket PID loops calibrated. All redundant temperature sensors within 0.15°C concord.',
    signedAt: '2026-11-16 13:58:10',
    verifiedBy: 'Dr. Sarah Chen (QA-8821)'
  },
  {
    id: 'SFT-2026-11-16-B',
    date: '2026-11-16',
    shift: 'Shift B (Afternoon 14:00 - 22:00)',
    leadOperator: 'Elena Rostova (OP-2203)',
    readingsLogged: 16,
    meanTemp: '22.6°C',
    meanPressure: '41.6 Pa',
    deviationsCount: 1,
    handoverSummary: 'Airlock momentary delta-P drop at 18:00 during raw material intake. TMR isolated Sensor B drift at 20:15 without batch compromise.',
    signedAt: '2026-11-16 21:55:04',
    verifiedBy: 'Dr. Sarah Chen (QA-8821)'
  }
];

export const INITIAL_AUDIT_TRAIL = [
  {
    id: 'AUD-8801',
    timestamp: '2026-11-16 06:00:12',
    user: 'Dr. Sarah Chen',
    role: 'Admin',
    action: 'BATCH_INITIALIZATION',
    details: 'Initiated batch BATCH-2026-VAC-098 with TMR 2-out-of-3 voting redundancy.',
    grade: 'Class A'
  },
  {
    id: 'AUD-8802',
    timestamp: '2026-11-16 14:00:45',
    user: 'Marcus Vance',
    role: 'Operator',
    action: 'SHIFT_HANDOVER',
    details: 'Completed Shift A turnover. Shift log SFT-2026-11-16-A electronically signed.',
    grade: 'Class B'
  },
  {
    id: 'AUD-8803',
    timestamp: '2026-11-16 18:02:11',
    user: 'Elena Rostova',
    role: 'Operator',
    action: 'LIMIT_CHECK_WARNING',
    details: 'Cleanroom Differential Pressure reached warning lower band (28.4 Pa). Auto-restored.',
    grade: 'Class B'
  },
  {
    id: 'AUD-8804',
    timestamp: '2026-11-16 20:16:30',
    user: 'Marcus Vance',
    role: 'Operator',
    action: 'FAULT_TOLERANCE_VOTE',
    details: 'Sensor B flagged with +0.65°C drift. TMR isolated Sensor B. Consensus maintained via Sensor A & C.',
    grade: 'Class B'
  },
  {
    id: 'AUD-8805',
    timestamp: '2026-11-16 21:40:15',
    user: 'System Controller',
    role: 'Automated System',
    action: 'STOCK_ALERT_GENERATION',
    details: 'Generated low stock alert for HEPES Buffer Solution Lot LOT-HEP-2025-99.',
    grade: 'System'
  }
];
