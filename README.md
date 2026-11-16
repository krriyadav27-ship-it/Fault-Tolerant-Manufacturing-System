# PharmaPulse FT-2000 | Fault-Tolerant Production Monitoring System

A pharmaceutical manufacturing front-end monitoring system built to maintain critical product quality, adhere to **Good Manufacturing Practices (cGMP)**, and comply with **FDA 21 CFR Part 11** electronic records and signatures.

---

## 🌟 Overview & Problem Statement

Pharmaceutical manufacturing requires continuous, uninterrupted monitoring of production conditions (core reaction temperature, cleanroom differential overpressure, and water-for-injection flow rate) to prevent batch degradation and ensure sterile drug safety.

**PharmaPulse FT-2000** integrates a **Triple Modular Redundancy (TMR)** hardware voting architecture directly into the front-end interface, ensuring that:
- Individual sensor drift, noisy hardware signals, or sudden probe disconnections are **isolated and voted out** in real time by majority quorum (2-out-of-3 consensus).
- Batch processing proceeds without unwarranted emergency line shutdowns.
- Operators and QA Directors are alerted immediately with full audit traceability and CAPA (Corrective and Preventive Action) documentation.

---

## 🚀 Key Modules Built

The application implements all 9 required front-end modules:

### 1. Login Interface
- **Role-Based Access**: Dedicated workflows for **Admin** (`Dr. Sarah Chen, QA Director`) and **Operators** (`Marcus Vance, Lead Operator` & `Elena Rostova, Process Technician`).
- **Electronic Signatures**: Compliant with **21 CFR Part 11** digital signatures and operator PIN verification.
- **One-Click Demo Switcher**: Instant role switching for swift demonstration and testing.

### 2. Dashboard
- **Scorecards**: Real-time display of **Consensus Temperature (°C)**, **Cleanroom Differential Pressure (Pa)**, **WFI Circulation Flow Rate (L/min)**, and **Fault Tolerance System Health Score (%)**.
- **TMR Redundancy Visualizer**: Live inspection tiles for **Sensor A (RTD PT-100 Core)**, **Sensor B (RTD PT-100 Hot Standby)**, and **Sensor C (Optical IR Pyrometer)** with pairwise concordance calculations.
- **Interactive Fault Injection Toolbar**: One-click test scenarios to simulate:
  - *Nominal State* (100% concordance)
  - *Sensor B Drift (+4.8°C)* (Shows TMR quorum voting B out while the line continues uninterrupted)
  - *Sensor A Disconnection* (Auto-failover to dual standby)
  - *Chamber Overheat Thermal Spike* (True critical excursion across all sensors)
  - *Cleanroom Differential Pressure Loss* (Airlock breach)
- **Active Batch Card**: Displays Batch Lot Number, active pharmaceutical product, operational stage, and compliance grade.

### 3. Production Monitoring
- **Readings Entry Form**: Operators log hourly observations for temperature, differential pressure, flow rate, ambient humidity, and agitator RPM.
- **Sensor Concordance Check**: Instant comparison of redundant sensors against drift boundaries before submitting.
- **Pre-filled Quick Testing Buttons**: One-click autofill for Normal, Warning, or Critical test readings.
- **Historical Production Table**: Live feed of submitted readings filterable by line and batch.

### 4. Limit Checking
- **Boundary Matrices**: Real-time evaluation into **Normal (Green)**, **Warning (Amber)**, and **Critical (Red)** operating zones.
- **Dynamic Visual Range Gauges**: Color-coded safety corridors with animated current-value marker pins.
- **Admin Specification Manager**: Allows QA Administrators to update operating setpoints and tolerances with mandatory GMP change justifications logged into the audit ledger.

### 5. History & Trends
- **Interactive High-Fidelity Charts**:
  - *Temperature vs Limits Chart*: Plots consensus temperature against Upper/Lower Specification Limits (USL/LSL) and Warning corridors.
  - *Multi-Sensor Redundancy Chart*: Visualizes Sensor A, B, and C curves alongside the voted consensus output to showcase noise rejection.
- **Readings Archive**: Searchable by batch ID, line, and operator.
- **Shift Turnover & Handover Ledger**: Logs shift summaries, average temperatures, deviation counts, and electronic sign-offs between outgoing and incoming personnel. Includes a modal to file new handover records.

### 6. Stock Management
- **Pharmaceutical Inventory Tracker**: Manages raw APIs, excipients, sterile buffer solutions, packaging vials, and cleanroom sanitizers.
- **Storage Condition Monitoring**: Flags cold-chain items (`2°C - 8°C`, `-20°C`) and room-temperature items.
- **Add & Update Stock**:
  - Add new material lots with statutory expiry dates.
  - Dispense for active batches or restock with reason tracking.
- **Expiry Countdown Badges**: Color-coded alerts for expired materials, materials expiring within 30 days, or adequate stock levels.

### 7. Alerts & Alarms
- **Centralized Event Dispatcher**: Categorizes alarms into **Temperature Excursions**, **Sensor Drift / Faults**, **Low Inventory**, and **Material Expiration**.
- **Severity Levels**: Critical (pulsing red audio-visual cues), Warning (amber), and Info.
- **Actionable Workflow**: One-click **Acknowledge** and **Resolve / CAPA** (Corrective and Preventive Action) documentation.
- **Synthetic Web Audio Chimes**: Cleanroom sound alerts synthesized via Web Audio API without external audio files.

### 8. Reports & Regulatory Certificates
- **Document Generation**:
  - *Batch Thermal Stability & Release Certificate* (MKT - Mean Kinetic Temperature, compliance percentages, lot release).
  - *Fault Tolerance & Sensor Reliability Audit Report* (TMR quorum performance, MTBF availability).
  - *Shift Production & Environmental Report*.
  - *Stock Inventory & Expiry Reconciliation Report*.
- **Export Options**: Real CSV download and printable / PDF-ready layout.

### 9. Settings & Audit Trail
- **Personnel Profile**: Edit cleanroom qualification grade, credentials, and digital signature PIN.
- **Redundancy Engine Selector**: Choose between Triple Modular Redundancy (TMR), Dual Hot-Standby, and Kalman Filter.
- **Drift Tolerance Slider**: Fine-tune sensor rejection sensitivity (±0.2°C to ±2.0°C).
- **21 CFR Part 11 Audit Trail**: Immutable chronological log capturing every user authentication, limit change, stock movement, and fault occurrence.
- **Factory Reset**: One-click restore to demo baseline.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (Clinical Cleanroom Dark Palette)
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API (Built-in synthesizer for hospital/pharma cleanroom chimes)
- **Architecture**: Modular React Context Architecture with localStorage persistence

---

## 💻 Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```
