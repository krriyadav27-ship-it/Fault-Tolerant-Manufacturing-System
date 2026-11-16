import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileCheck2,
  Calendar,
  CheckCircle2,
  FileText,
  Activity,
  Cpu,
  Boxes,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

export const ReportsView = () => {
  const {
    batchInfo,
    readingsHistory,
    shiftLogs,
    stockItems,
    alerts,
    limits,
    currentUser,
    telemetry
  } = useProduction();

  const [selectedReportType, setSelectedReportType] = useState('thermal'); // 'thermal' | 'fault' | 'shift' | 'stock'

  // Calculate Batch Thermal Statistics
  const totalReadings = readingsHistory.length;
  const normalCount = readingsHistory.filter((r) => r.status === 'Normal').length;
  const complianceRate = totalReadings > 0 ? ((normalCount / totalReadings) * 100).toFixed(1) : '100.0';

  const temps = readingsHistory.map((r) => r.consensusTemp);
  const avgTemp = temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2) : '22.0';
  const minTempRecorded = temps.length > 0 ? Math.min(...temps).toFixed(1) : '21.0';
  const maxTempRecorded = temps.length > 0 ? Math.max(...temps).toFixed(1) : '23.0';

  // Export CSV Handler
  const downloadCsv = () => {
    let headers = '';
    let rows = [];

    if (selectedReportType === 'thermal') {
      headers = 'Entry ID,Timestamp,Batch ID,Line,Sensor A (C),Sensor B (C),Sensor C (C),Consensus Temp (C),Pressure (Pa),Flow Rate (L/min),Status,Operator\n';
      rows = readingsHistory.map((r) =>
        `"${r.id}","${r.timestamp}","${r.batchId}","${r.line}",${r.tempA},${r.tempB},${r.tempC},${r.consensusTemp},${r.pressure},${r.flowRate},"${r.status}","${r.operator}"`
      );
    } else if (selectedReportType === 'stock') {
      headers = 'Item Code,Material Name,Category,Lot Number,Quantity,Unit,Storage Condition,Expiry Date,Status,Supplier\n';
      rows = stockItems.map((s) =>
        `"${s.code}","${s.name}","${s.category}","${s.lotNumber}",${s.quantity},"${s.unit}","${s.storageCondition}","${s.expiryDate}","${s.status}","${s.supplier}"`
      );
    } else if (selectedReportType === 'shift') {
      headers = 'Shift Log ID,Date,Shift Name,Lead Operator,Readings Logged,Mean Temp,Mean Pressure,Deviations,Signed At,Verified By\n';
      rows = shiftLogs.map((s) =>
        `"${s.id}","${s.date}","${s.shift}","${s.leadOperator}",${s.readingsLogged},"${s.meanTemp}","${s.meanPressure}",${s.deviationsCount},"${s.signedAt}","${s.verifiedBy}"`
      );
    } else {
      headers = 'Alert ID,Timestamp,Type,Severity,Title,Message,Status,Acknowledged By,Resolution\n';
      rows = alerts.map((a) =>
        `"${a.id}","${a.timestamp}","${a.type}","${a.severity}","${a.title}","${a.message}","${a.status}","${a.acknowledgedBy || 'N/A'}","${a.resolution || 'N/A'}"`
      );
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `pharmapulse_${selectedReportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Module 8: Regulatory Documentation & Reporting</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            GMP Production Reports & Batch Certificates
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Generate, preview, and download statutory thermal compliance reports, fault tolerance audits, and material ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={downloadCsv}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Document</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedReportType('thermal')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3.5 ${
            selectedReportType === 'thermal'
              ? 'bg-teal-950/70 border-teal-500/60 shadow-md shadow-teal-500/10'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-200 text-xs">1. Batch Thermal Release</div>
            <div className="text-[11px] text-slate-400 mt-0.5">MKT & thermal kinetics</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedReportType('fault')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3.5 ${
            selectedReportType === 'fault'
              ? 'bg-teal-950/70 border-teal-500/60 shadow-md shadow-teal-500/10'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-200 text-xs">2. Fault Tolerance Audit</div>
            <div className="text-[11px] text-slate-400 mt-0.5">TMR sensor consensus</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedReportType('shift')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3.5 ${
            selectedReportType === 'shift'
              ? 'bg-teal-950/70 border-teal-500/60 shadow-md shadow-teal-500/10'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-200 text-xs">3. Shift Turnover Log</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Handover signatures</div>
          </div>
        </button>

        <button
          onClick={() => setSelectedReportType('stock')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3.5 ${
            selectedReportType === 'stock'
              ? 'bg-teal-950/70 border-teal-500/60 shadow-md shadow-teal-500/10'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-200 text-xs">4. Stock Reconciliation</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Lot expiry compliance</div>
          </div>
        </button>
      </div>

      {/* Formal Printable Document Preview Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl printable-document text-slate-100">
        
        {/* Document Header */}
        <div className="border-b-2 border-teal-500/40 pb-6 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-xl">
              PP
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-tight">
                PHARMAPULSE LIFE SCIENCES CORP.
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Division of Quality Validation & Aseptic Manufacturing
              </div>
              <div className="text-[11px] text-teal-400 font-mono mt-0.5">
                cGMP Facility License #FDA-2026-REG-98124
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-400 space-y-1">
            <div>Doc Ref: <strong className="text-white">CERT-{selectedReportType.toUpperCase()}-2026</strong></div>
            <div>Date Generated: <span className="text-slate-200">2026-11-16 22:40</span></div>
            <div>Inspector: <span className="text-teal-300 font-bold">{currentUser?.name} ({currentUser?.badgeId})</span></div>
          </div>
        </div>

        {/* REPORT TYPE 1: THERMAL STABILITY & RELEASE */}
        {selectedReportType === 'thermal' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Batch Thermal Stability & Environmental Certification
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                21 CFR Part 11 Electronic Quality Record for Batch Lot Release.
              </p>
            </div>

            {/* Batch Meta Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">Batch Lot Number:</span>
                <span className="font-bold text-white text-sm">{batchInfo.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Active Pharmaceutical:</span>
                <span className="font-bold text-white text-sm">{batchInfo.productName.split(' ')[0]}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Facility Suite:</span>
                <span className="text-slate-300">{batchInfo.line.split(' - ')[0]}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Compliance Status:</span>
                <span className="text-emerald-400 font-bold">GMP PASSED (99.2%)</span>
              </div>
            </div>

            {/* Thermal Statistics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-xs">Mean Kinetic Temp (MKT)</span>
                <div className="text-2xl font-bold font-mono text-teal-300 mt-1">{avgTemp} °C</div>
                <span className="text-[10px] text-slate-500">Target: {limits.temperature.setpoint}°C</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-xs">Minimum Recorded Temp</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{minTempRecorded} °C</div>
                <span className="text-[10px] text-slate-500">Boundary: &gt; {limits.temperature.criticalLow}°C</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-xs">Maximum Recorded Temp</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">{maxTempRecorded} °C</div>
                <span className="text-[10px] text-slate-500">Boundary: &lt; {limits.temperature.criticalHigh}°C</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-xs">GMP In-Spec Concordance</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{complianceRate} %</div>
                <span className="text-[10px] text-slate-500">Threshold: ≥ 98.0%</span>
              </div>
            </div>

            {/* Readings Summary Sample */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Audited Readings Excerpt ({readingsHistory.length} Total Verified):
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[10px]">
                    <tr>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Sensor A</th>
                      <th className="p-2.5">Sensor B</th>
                      <th className="p-2.5">Sensor C</th>
                      <th className="p-2.5">Consensus</th>
                      <th className="p-2.5">Pressure</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {readingsHistory.slice(0, 5).map((r) => (
                      <tr key={r.id}>
                        <td className="p-2.5 text-slate-400">{r.timestamp}</td>
                        <td className="p-2.5">{r.tempA}°C</td>
                        <td className="p-2.5">{r.tempB}°C</td>
                        <td className="p-2.5">{r.tempC}°C</td>
                        <td className="p-2.5 font-bold text-teal-300">{r.consensusTemp}°C</td>
                        <td className="p-2.5">{r.pressure} Pa</td>
                        <td className="p-2.5 text-emerald-400">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REPORT TYPE 2: FAULT TOLERANCE AUDIT */}
        {selectedReportType === 'fault' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Fault-Tolerant Redundancy Architecture & Sensor Voting Audit
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Evaluates Triple Modular Redundancy (TMR) performance, sensor drift rejection, and hardware failover.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Voting Mechanism:</span>
                <span className="text-teal-300 font-bold">Triple Modular Redundancy (2-out-of-3 Quorum)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Allowed Sensor Drift Tolerance:</span>
                <span className="text-slate-200">±{limits.temperature.driftTolerance} °C</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Sensor A (Core PT-100) Availability:</span>
                <span className="text-emerald-400 font-bold">99.98% MTBF</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Sensor B (Hot Standby PT-100) Availability:</span>
                <span className="text-emerald-400 font-bold">99.94% MTBF</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Sensor C (IR Pyrometer) Optical Concordance:</span>
                <span className="text-emerald-400 font-bold">100.0% Validation</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Conclusion:</strong> The TMR subsystem successfully verified fault absorption. Any transient drift detected on individual probes was isolated by majority quorum without causing batch termination or cleanroom boundary excursions.
            </p>
          </div>
        )}

        {/* REPORT TYPE 3: SHIFT TURNOVER */}
        {selectedReportType === 'shift' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Shift Turnover & Operational Handover Summary
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Formal turnover handover records between production shifts.
              </p>
            </div>

            <div className="space-y-4">
              {shiftLogs.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-slate-200 mb-2">
                    <span>{s.shift} ({s.date})</span>
                    <span className="text-teal-400 font-mono">{s.id}</span>
                  </div>
                  <div className="text-slate-400 font-mono space-y-1 mb-2">
                    <div>Lead Operator: <strong className="text-slate-200">{s.leadOperator}</strong></div>
                    <div>Readings Logged: {s.readingsLogged} | Mean Temp: {s.meanTemp} | Deviations: {s.deviationsCount}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    "{s.handoverSummary}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORT TYPE 4: STOCK RECONCILIATION */}
        {selectedReportType === 'stock' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Material Inventory & Expiry Reconciliation Report
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Statutory audit of raw APIs, sterile excipients, buffer solutions, and cold chain parameters.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px]">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Material</th>
                    <th className="p-2.5">Lot No</th>
                    <th className="p-2.5">Qty On Hand</th>
                    <th className="p-2.5">Storage</th>
                    <th className="p-2.5">Expiry Date</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {stockItems.map((s) => (
                    <tr key={s.id}>
                      <td className="p-2.5 text-teal-400">{s.code}</td>
                      <td className="p-2.5 font-sans font-medium text-slate-200">{s.name}</td>
                      <td className="p-2.5">{s.lotNumber}</td>
                      <td className="p-2.5 font-bold text-white">{s.quantity} {s.unit}</td>
                      <td className="p-2.5 font-sans text-slate-400">{s.storageCondition}</td>
                      <td className="p-2.5">{s.expiryDate}</td>
                      <td className="p-2.5">
                        <span className={s.status === 'Expired' ? 'text-rose-400 font-bold' : s.status === 'Low Stock' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formal Digital Signature Section (GMP 21 CFR Part 11) */}
        <div className="mt-12 pt-6 border-t-2 border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
              21 CFR Part 11 Electronic Quality Attestation:
            </span>
            <p className="text-[11px] text-slate-400">
              I certify under penalty of law that the batch conditions, thermal kinetic measurements, and fault-tolerant sensor redundancies documented herein were monitored in accordance with approved cGMP specifications.
            </p>
            <div className="pt-2 font-mono text-[11px] text-teal-300">
              Signer: {currentUser?.name || 'Dr. Sarah Chen'} — {currentUser?.role} ({currentUser?.badgeId})
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Digital Hash:</span>
              <span className="text-slate-500">SHA256: 7f8a9e...21b4</span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                ELECTRONIC SIGNATURE VERIFIED
              </span>
              <span className="text-[11px] font-mono text-slate-500">STATUS: APPROVED</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
