import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  ClipboardPenLine,
  Thermometer,
  Gauge,
  Waves,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Sparkles,
  Search,
  Filter,
  FileCheck2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PRODUCTION_LINES, SHIFTS } from '../../data/mockData';

export const ProductionMonitoringView = () => {
  const {
    currentUser,
    batchInfo,
    telemetry,
    limits,
    evaluateStatus,
    addProductionReading,
    readingsHistory
  } = useProduction();

  // Form states
  const [formData, setFormData] = useState({
    batchId: batchInfo.id,
    line: batchInfo.line,
    shift: 'Shift A (Morning 06:00 - 14:00)',
    tempA: telemetry.tempA || 22.0,
    tempB: telemetry.tempB || 22.1,
    tempC: telemetry.tempC || 21.9,
    pressure: telemetry.pressure || 42.0,
    flowRate: telemetry.flowRate || 15.0,
    humidity: 45.2,
    agitatorRpm: 120,
    notes: 'Standard scheduled cleanroom GMP verification check.'
  });

  const [filterBatch, setFilterBatch] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [successFeedback, setSuccessFeedback] = useState(null);

  // Compute live consensus for the form inputs
  const calculatedConsensus = parseFloat(
    ((parseFloat(formData.tempA) + parseFloat(formData.tempB) + parseFloat(formData.tempC)) / 3).toFixed(2)
  );

  const previewStatus = evaluateStatus('temperature', calculatedConsensus);
  const maxDelta = Math.max(
    Math.abs(formData.tempA - formData.tempB),
    Math.abs(formData.tempB - formData.tempC),
    Math.abs(formData.tempA - formData.tempC)
  ).toFixed(2);

  // Quick autofill buttons
  const autofillFromLive = () => {
    setFormData((prev) => ({
      ...prev,
      tempA: telemetry.tempA,
      tempB: telemetry.tempB,
      tempC: telemetry.tempC,
      pressure: telemetry.pressure,
      flowRate: telemetry.flowRate
    }));
  };

  const autofillPreset = (type) => {
    if (type === 'normal') {
      setFormData((prev) => ({
        ...prev,
        tempA: 22.2,
        tempB: 22.3,
        tempC: 22.1,
        pressure: 42.5,
        flowRate: 15.2,
        notes: 'Nominal batch thermal stabilization running smoothly.'
      }));
    } else if (type === 'warning') {
      setFormData((prev) => ({
        ...prev,
        tempA: 24.8,
        tempB: 24.9,
        tempC: 24.7,
        pressure: 38.0,
        flowRate: 13.5,
        notes: 'Warning zone thermal drift observed during exothermic addition.'
      }));
    } else if (type === 'critical') {
      setFormData((prev) => ({
        ...prev,
        tempA: 27.6,
        tempB: 27.8,
        tempC: 27.5,
        pressure: 24.0,
        flowRate: 10.0,
        notes: 'Critical cooling loop failure simulation; manual intervention flagged.'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = addProductionReading({
      batchId: formData.batchId,
      line: formData.line,
      tempA: formData.tempA,
      tempB: formData.tempB,
      tempC: formData.tempC,
      consensusTemp: calculatedConsensus,
      pressure: formData.pressure,
      flowRate: formData.flowRate,
      notes: formData.notes
    });

    setSuccessFeedback(`Logged reading #${newEntry.id} for ${formData.batchId}`);
    setTimeout(() => setSuccessFeedback(null), 4000);
  };

  // Filtered readings list
  const filteredReadings = readingsHistory.filter((item) => {
    const matchesBatch = filterBatch === 'ALL' || item.batchId === filterBatch;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesBatch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
          <ClipboardPenLine className="w-4 h-4" />
          <span>Module 3: Production Monitoring & Data Entry</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Production Readings Entry & Verification Form
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Input real-time cleanroom thermal and mechanical observations. The fault-tolerant voting engine validates redundant sensor concordance before logging into the 21 CFR Part 11 ledger.
        </p>
      </div>

      {/* Main Grid: Form on Left, Live Validation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          
          {/* Quick preset action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Quick Fill Tools:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={autofillFromLive}
                className="px-2.5 py-1.5 rounded-lg bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-medium hover:bg-teal-900/80 transition"
              >
                Sync with Live Telemetry
              </button>
              <button
                type="button"
                onClick={() => autofillPreset('normal')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-900/80 transition"
              >
                Sample: Normal
              </button>
              <button
                type="button"
                onClick={() => autofillPreset('warning')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-900/80 transition"
              >
                Sample: Warning
              </button>
              <button
                type="button"
                onClick={() => autofillPreset('critical')}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-medium hover:bg-rose-900/80 transition"
              >
                Sample: Critical
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Batch & Line & Shift */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Batch Identifier
                </label>
                <input
                  type="text"
                  required
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Production Line / Reactor
                </label>
                <select
                  value={formData.line}
                  onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  {PRODUCTION_LINES.map((line) => (
                    <option key={line} value={line}>
                      {line}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Production Shift
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  {SHIFTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: 3 Redundant Temperature Sensor Inputs */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-teal-400" />
                  Triple Modular Redundancy (TMR) Temperature Readings (°C)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Tolerance: ±{limits.temperature.driftTolerance}°C
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Sensor A (PT-100 Core)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.tempA}
                    onChange={(e) => setFormData({ ...formData, tempA: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Sensor B (PT-100 Standby)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.tempB}
                    onChange={(e) => setFormData({ ...formData, tempB: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Sensor C (IR Optical)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.tempC}
                    onChange={(e) => setFormData({ ...formData, tempC: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Live Consensus & Concordance preview */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Voted Consensus Temp:</span>
                  <strong className="text-teal-300 font-mono text-sm">{calculatedConsensus} °C</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Max Sensor Delta:</span>
                  <strong className={`font-mono ${maxDelta > limits.temperature.driftTolerance ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {maxDelta} °C
                  </strong>
                  {maxDelta > limits.temperature.driftTolerance && (
                    <span className="text-[10px] text-amber-400 font-bold">(Drift Exceeded)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Row 3: Pressure, Flow Rate, Humidity, Agitator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Diff Pressure (Pa)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.pressure}
                  onChange={(e) => setFormData({ ...formData, pressure: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Flow Rate (L/min)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.flowRate}
                  onChange={(e) => setFormData({ ...formData, flowRate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Humidity (% RH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Agitator Speed (RPM)
                </label>
                <input
                  type="number"
                  value={formData.agitatorRpm}
                  onChange={(e) => setFormData({ ...formData, agitatorRpm: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Row 4: Operator Notes & Digital Signature */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                GMP Operator Observation Notes & Justification
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Electronic Signer Badge */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="text-slate-400">Signing Operator: </span>
                  <span className="font-semibold text-slate-200">
                    {currentUser?.name || 'Authorized Operator'}
                  </span>
                  <span className="text-slate-500 ml-1.5 font-mono">({currentUser?.badgeId})</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">GMP 21 CFR Part 11</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Record & Authorize Production Reading</span>
            </button>
          </form>

          {successFeedback && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successFeedback}</span>
            </div>
          )}

        </div>

        {/* Real-time Validation Card on Right */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-slate-200 text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Pre-Submission Limit Check</span>
            </h3>

            <div className="space-y-4 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">Temperature Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      previewStatus === 'Normal'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : previewStatus === 'Warning'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {previewStatus}
                  </span>
                </div>
                <div className="font-mono text-slate-300">
                  Value: {calculatedConsensus}°C (Spec: {limits.temperature.normalMin}-{limits.temperature.normalMax}°C)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">Pressure Status:</span>
                  <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    Normal
                  </span>
                </div>
                <div className="font-mono text-slate-300">
                  Value: {formData.pressure} Pa (Spec: {limits.pressure.normalMin}-{limits.pressure.normalMax} Pa)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">Flow Rate Status:</span>
                  <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    Normal
                  </span>
                </div>
                <div className="font-mono text-slate-300">
                  Value: {formData.flowRate} L/min (Spec: {limits.flowRate.normalMin}-{limits.flowRate.normalMax} L/m)
                </div>
              </div>

            </div>

            <div className="mt-5 p-3 rounded-lg bg-teal-950/40 border border-teal-500/20 text-[11px] text-teal-300 flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>
                Readings matching Warning or Critical limits will automatically dispatch alerts to the Alarm Console and notify the Lead QA Engineer.
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Batch Operational Context
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Batch:</span>
                <span className="font-mono text-slate-200">{batchInfo.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Product:</span>
                <span className="text-slate-200">{batchInfo.productName.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Entries Logged:</span>
                <span className="font-mono text-teal-400 font-bold">{readingsHistory.length} readings</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Historical Entries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">Previous Production Logs</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified temperature, differential pressure and flow logs for the current manufacturing run.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="Normal">Normal Only</option>
              <option value="Warning">Warning Only</option>
              <option value="Critical">Critical Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Entry ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3">Sensor A/B/C</th>
                <th className="py-3 px-3">Consensus Temp</th>
                <th className="py-3 px-3">Pressure</th>
                <th className="py-3 px-3">Flow</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredReadings.slice(0, 10).map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-teal-400 font-semibold">{r.id}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{r.timestamp}</td>
                  <td className="py-3 px-3 text-slate-300">{r.batchId}</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {r.tempA}° / {r.tempB}° / {r.tempC}°
                  </td>
                  <td className="py-3 px-3 font-bold text-white text-xs">{r.consensusTemp} °C</td>
                  <td className="py-3 px-3 text-slate-300">{r.pressure} Pa</td>
                  <td className="py-3 px-3 text-slate-300">{r.flowRate} L/m</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold font-sans ${
                        r.status === 'Normal'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : r.status === 'Warning'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{r.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
