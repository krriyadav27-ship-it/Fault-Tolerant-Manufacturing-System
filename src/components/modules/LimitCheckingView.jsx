import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Thermometer,
  Gauge,
  Waves,
  Edit3,
  Save,
  RotateCcw,
  Lock,
  Unlock,
  Info
} from 'lucide-react';

export const LimitCheckingView = () => {
  const {
    currentUser,
    limits,
    updateLimits,
    telemetry,
    evaluateStatus,
    simulatedFault
  } = useProduction();

  const [isEditing, setIsEditing] = useState(false);
  const [editLimits, setEditLimits] = useState({ ...limits });
  const [changeReason, setChangeReason] = useState('Annual GMP Thermal Stability SOP Re-evaluation');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAdmin = currentUser?.role === 'Admin';

  const tempStatus = evaluateStatus('temperature', telemetry.consensusTemp);
  const pressureStatus = evaluateStatus('pressure', telemetry.pressure);
  const flowStatus = evaluateStatus('flowRate', telemetry.flowRate);

  const handleSave = (e) => {
    e.preventDefault();
    updateLimits(editLimits, changeReason);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditLimits({ ...limits });
    setIsEditing(false);
  };

  // Helper to render visual range bar
  const renderRangeBar = (val, min, max, warnL, warnH, critL, critH, unit) => {
    // Normal range normalized from 0 to 100%
    const totalSpan = critH - critL + (critH - critL) * 0.2;
    const baseOffset = critL - (critH - critL) * 0.1;

    const toPercent = (v) => Math.max(0, Math.min(100, ((v - baseOffset) / totalSpan) * 100));

    const curPct = toPercent(val);
    const critLPct = toPercent(critL);
    const warnLPct = toPercent(warnL);
    const warnHPct = toPercent(warnH);
    const critHPct = toPercent(critH);

    return (
      <div className="space-y-2 mt-4">
        {/* The Bar */}
        <div className="relative h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
          {/* Critical Low Band */}
          <div style={{ width: `${warnLPct}%` }} className="h-full bg-rose-500/20 border-r border-rose-500/40" title="Critical Low Zone" />
          {/* Warning Low Band */}
          <div style={{ width: `${toPercent(min) - warnLPct}%` }} className="h-full bg-amber-500/25 border-r border-amber-500/40" title="Warning Low Zone" />
          {/* Normal Band */}
          <div style={{ width: `${toPercent(max) - toPercent(min)}%` }} className="h-full bg-emerald-500/30 border-r border-emerald-500/40" title="Normal Operating Band" />
          {/* Warning High Band */}
          <div style={{ width: `${warnHPct - toPercent(max)}%` }} className="h-full bg-amber-500/25 border-r border-amber-500/40" title="Warning High Zone" />
          {/* Critical High Band */}
          <div className="flex-1 h-full bg-rose-500/20" title="Critical High Zone" />

          {/* Current Value Marker Pin */}
          <div
            style={{ left: `${curPct}%` }}
            className="absolute top-0 bottom-0 w-2.5 -ml-1.5 bg-white border border-slate-900 shadow-md rounded-sm z-10 transition-all duration-500"
          />
        </div>

        {/* Legend beneath the bar */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span className="text-rose-400">Crit &lt; {critL}{unit}</span>
          <span className="text-amber-400">Warn {warnL}{unit}</span>
          <span className="text-emerald-400 font-bold">Normal ({min} - {max}{unit})</span>
          <span className="text-amber-400">Warn {warnH}{unit}</span>
          <span className="text-rose-400">Crit &gt; {critH}{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Module 4: Limit Checking & Specification Matrix</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Process Tolerance Limits & Boundary Verification
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Continuous boundary classification displaying Normal (Green), Warning (Amber), and Critical (Red) operating states.
          </p>
        </div>

        {isAdmin ? (
          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-teal-400" />
                <span>Edit Process Limits (Admin)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-750"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save & Log to Audit
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Limit editing restricted to QA Admin</span>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Process specification limits updated and logged into the 21 CFR Part 11 Audit Trail.</span>
        </div>
      )}

      {/* Real-time Status Badges & Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Temperature Gauge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <Thermometer className="w-4 h-4 text-teal-400" />
              <span>Core Reaction Temp</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                tempStatus === 'Normal'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : tempStatus === 'Warning'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
              }`}
            >
              {tempStatus === 'Normal' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {tempStatus === 'Warning' && <AlertTriangle className="w-3.5 h-3.5" />}
              {tempStatus === 'Critical' && <AlertOctagon className="w-3.5 h-3.5" />}
              {tempStatus} Status
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {telemetry.consensusTemp} °C
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Target Setpoint: {limits.temperature.setpoint} °C
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Normal Zone:</div>
              <div className="text-emerald-400 font-bold">{limits.temperature.normalMin} - {limits.temperature.normalMax} °C</div>
            </div>
          </div>

          {renderRangeBar(
            telemetry.consensusTemp,
            limits.temperature.normalMin,
            limits.temperature.normalMax,
            limits.temperature.warningLow,
            limits.temperature.warningHigh,
            limits.temperature.criticalLow,
            limits.temperature.criticalHigh,
            '°'
          )}

          <div className="mt-4 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
            {tempStatus === 'Normal' && (
              <span className="text-emerald-400 font-medium">✓ Temperature is strictly within the GMP validated safe operating band.</span>
            )}
            {tempStatus === 'Warning' && (
              <span className="text-amber-400 font-medium">⚠ Thermal drift entering warning corridor. Automated chilling ramp active.</span>
            )}
            {tempStatus === 'Critical' && (
              <span className="text-rose-400 font-medium font-bold">⛔ Critical thermal excursion! Automated emergency cooling diverter engaged.</span>
            )}
          </div>
        </div>

        {/* Pressure Gauge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Differential Pressure</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                pressureStatus === 'Normal'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : pressureStatus === 'Warning'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
              }`}
            >
              {pressureStatus === 'Normal' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {pressureStatus === 'Warning' && <AlertTriangle className="w-3.5 h-3.5" />}
              {pressureStatus === 'Critical' && <AlertOctagon className="w-3.5 h-3.5" />}
              {pressureStatus} Status
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {telemetry.pressure} Pa
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Target Setpoint: {limits.pressure.setpoint} Pa
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Normal Zone:</div>
              <div className="text-cyan-400 font-bold">{limits.pressure.normalMin} - {limits.pressure.normalMax} Pa</div>
            </div>
          </div>

          {renderRangeBar(
            telemetry.pressure,
            limits.pressure.normalMin,
            limits.pressure.normalMax,
            limits.pressure.warningLow,
            limits.pressure.warningHigh,
            limits.pressure.criticalLow,
            limits.pressure.criticalHigh,
            'Pa'
          )}

          <div className="mt-4 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
            {pressureStatus === 'Normal' && (
              <span className="text-emerald-400 font-medium">✓ Cleanroom positive overpressure ensures ISO Class 5 sterility boundary.</span>
            )}
            {pressureStatus !== 'Normal' && (
              <span className="text-amber-400 font-medium">⚠ Cleanroom delta-P compromised. Risk of particle ingress from corridor.</span>
            )}
          </div>
        </div>

        {/* Flow Rate Gauge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <Waves className="w-4 h-4 text-blue-400" />
              <span>WFI Circulation Flow</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                flowStatus === 'Normal'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : flowStatus === 'Warning'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
              }`}
            >
              {flowStatus === 'Normal' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {flowStatus === 'Warning' && <AlertTriangle className="w-3.5 h-3.5" />}
              {flowStatus === 'Critical' && <AlertOctagon className="w-3.5 h-3.5" />}
              {flowStatus} Status
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {telemetry.flowRate} L/m
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Target Setpoint: {limits.flowRate.setpoint} L/min
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Normal Zone:</div>
              <div className="text-blue-400 font-bold">{limits.flowRate.normalMin} - {limits.flowRate.normalMax} L/m</div>
            </div>
          </div>

          {renderRangeBar(
            telemetry.flowRate,
            limits.flowRate.normalMin,
            limits.flowRate.normalMax,
            limits.flowRate.warningLow,
            limits.flowRate.warningHigh,
            limits.flowRate.criticalLow,
            limits.flowRate.criticalHigh,
            'L'
          )}

          <div className="mt-4 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
            {flowStatus === 'Normal' && (
              <span className="text-emerald-400 font-medium">✓ Turbulent self-sanitizing velocity maintained across jacket loops.</span>
            )}
            {flowStatus !== 'Normal' && (
              <span className="text-amber-400 font-medium">⚠ Stagnant flow warning. Biofilm formation prevention threshold breached.</span>
            )}
          </div>
        </div>

      </div>

      {/* Limit Specification Editor / Threshold Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">
              GMP Master Process Specification Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Defines the regulatory validation envelope approved by QA & Regulatory Affairs.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Document: <strong className="text-slate-300">SOP-ENG-FT-2026-v4.1</strong>
          </span>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Temperature Inputs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/40 space-y-3">
                <span className="text-xs font-bold text-teal-400 uppercase font-mono block">
                  Temperature Limits (°C)
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400">Target Setpoint:</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editLimits.temperature.setpoint}
                      onChange={(e) => setEditLimits({
                        ...editLimits,
                        temperature: { ...editLimits.temperature, setpoint: parseFloat(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400">Normal Min:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editLimits.temperature.normalMin}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          temperature: { ...editLimits.temperature, normalMin: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">Normal Max:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editLimits.temperature.normalMax}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          temperature: { ...editLimits.temperature, normalMax: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400">Warning Low:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editLimits.temperature.warningLow}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          temperature: { ...editLimits.temperature, warningLow: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">Warning High:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editLimits.temperature.warningHigh}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          temperature: { ...editLimits.temperature, warningHigh: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pressure Inputs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono block">
                  Differential Pressure Limits (Pa)
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400">Target Setpoint:</label>
                    <input
                      type="number"
                      step="1"
                      value={editLimits.pressure.setpoint}
                      onChange={(e) => setEditLimits({
                        ...editLimits,
                        pressure: { ...editLimits.pressure, setpoint: parseFloat(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400">Normal Min:</label>
                      <input
                        type="number"
                        step="1"
                        value={editLimits.pressure.normalMin}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          pressure: { ...editLimits.pressure, normalMin: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">Normal Max:</label>
                      <input
                        type="number"
                        step="1"
                        value={editLimits.pressure.normalMax}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          pressure: { ...editLimits.pressure, normalMax: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flow Rate Inputs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase font-mono block">
                  Flow Rate Limits (L/min)
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400">Target Setpoint:</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editLimits.flowRate.setpoint}
                      onChange={(e) => setEditLimits({
                        ...editLimits,
                        flowRate: { ...editLimits.flowRate, setpoint: parseFloat(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400">Normal Min:</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editLimits.flowRate.normalMin}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          flowRate: { ...editLimits.flowRate, normalMin: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400">Normal Max:</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editLimits.flowRate.normalMax}
                        onChange={(e) => setEditLimits({
                          ...editLimits,
                          flowRate: { ...editLimits.flowRate, normalMax: parseFloat(e.target.value) }
                        })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Reason for change */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Regulatory Justification & Engineering Change Notice (ECN) Reason:
              </label>
              <input
                type="text"
                required
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="e.g. Protocol Validation amendment QA-2026-VAL-882"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Apply & Sign Change
              </button>
            </div>
          </form>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Monitored Parameter</th>
                  <th className="py-3 px-3">Setpoint</th>
                  <th className="py-3 px-3">Normal Zone</th>
                  <th className="py-3 px-3">Warning Band</th>
                  <th className="py-3 px-3">Critical Boundary</th>
                  <th className="py-3 px-3">Current Value</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-3 px-3 text-slate-200 font-sans font-semibold">
                    Core Reaction Temperature
                  </td>
                  <td className="py-3 px-3 text-slate-300">{limits.temperature.setpoint} °C</td>
                  <td className="py-3 px-3 text-emerald-400">
                    {limits.temperature.normalMin} - {limits.temperature.normalMax} °C
                  </td>
                  <td className="py-3 px-3 text-amber-400">
                    {limits.temperature.warningLow} - {limits.temperature.warningHigh} °C
                  </td>
                  <td className="py-3 px-3 text-rose-400">
                    &lt; {limits.temperature.criticalLow} or &gt; {limits.temperature.criticalHigh} °C
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{telemetry.consensusTemp} °C</td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      tempStatus === 'Normal' ? 'bg-emerald-950 text-emerald-300' : tempStatus === 'Warning' ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
                    }`}>
                      {tempStatus}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 text-slate-200 font-sans font-semibold">
                    Differential Cleanroom Pressure
                  </td>
                  <td className="py-3 px-3 text-slate-300">{limits.pressure.setpoint} Pa</td>
                  <td className="py-3 px-3 text-emerald-400">
                    {limits.pressure.normalMin} - {limits.pressure.normalMax} Pa
                  </td>
                  <td className="py-3 px-3 text-amber-400">
                    {limits.pressure.warningLow} - {limits.pressure.warningHigh} Pa
                  </td>
                  <td className="py-3 px-3 text-rose-400">
                    &lt; {limits.pressure.criticalLow} or &gt; {limits.pressure.criticalHigh} Pa
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{telemetry.pressure} Pa</td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      pressureStatus === 'Normal' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {pressureStatus}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-3 text-slate-200 font-sans font-semibold">
                    WFI Circulation Flow Rate
                  </td>
                  <td className="py-3 px-3 text-slate-300">{limits.flowRate.setpoint} L/m</td>
                  <td className="py-3 px-3 text-emerald-400">
                    {limits.flowRate.normalMin} - {limits.flowRate.normalMax} L/m
                  </td>
                  <td className="py-3 px-3 text-amber-400">
                    {limits.flowRate.warningLow} - {limits.flowRate.warningHigh} L/m
                  </td>
                  <td className="py-3 px-3 text-rose-400">
                    &lt; {limits.flowRate.criticalLow} or &gt; {limits.flowRate.criticalHigh} L/m
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{telemetry.flowRate} L/m</td>
                  <td className="py-3 px-3 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      flowStatus === 'Normal' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {flowStatus}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
