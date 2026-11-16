import React from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  Thermometer,
  Gauge,
  Waves,
  HeartPulse,
  Activity,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Cpu,
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock,
  FlaskConical,
  Flame,
  Wind
} from 'lucide-react';

export const DashboardView = ({ setActiveTab }) => {
  const {
    telemetry,
    limits,
    batchInfo,
    simulatedFault,
    setSimulatedFault,
    evaluateStatus,
    redundancyMode,
    heartbeat
  } = useProduction();

  const tempStatus = evaluateStatus('temperature', telemetry.consensusTemp);
  const pressureStatus = evaluateStatus('pressure', telemetry.pressure);
  const flowStatus = evaluateStatus('flowRate', telemetry.flowRate);

  // Status Colors Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Normal
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Warning
          </span>
        );
      case 'Critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            Critical
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Active Manufacturing Batch */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
                  {batchInfo.id}
                </span>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {batchInfo.status}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-mono">{batchInfo.complianceGrade}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {batchInfo.productName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Stage: <strong className="text-slate-300">{batchInfo.stage}</strong> | Target: {batchInfo.targetVolume} | {batchInfo.line}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-end lg:self-center">
            <button
              onClick={() => setActiveTab('monitoring')}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition cursor-pointer"
            >
              Log New Reading
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              Batch Report
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Consensus Temperature */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Core Temperature
            </span>
            {getStatusBadge(tempStatus)}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {telemetry.consensusTemp}
                <span className="text-lg text-slate-400 font-sans ml-1">°C</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <span>Setpoint: {limits.temperature.setpoint}°C</span>
                <span className="text-slate-600">•</span>
                <span className="text-teal-400 font-mono font-medium">TMR Voted</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${tempStatus === 'Normal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <Thermometer className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Range: {limits.temperature.normalMin} - {limits.temperature.normalMax}°C</span>
            <span className="text-slate-500 font-mono">Δ {(telemetry.consensusTemp - limits.temperature.setpoint).toFixed(2)}°C</span>
          </div>
        </div>

        {/* Card 2: Differential Pressure */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cleanroom Delta-P
            </span>
            {getStatusBadge(pressureStatus)}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {telemetry.pressure}
                <span className="text-lg text-slate-400 font-sans ml-1">Pa</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <span>Setpoint: {limits.pressure.setpoint} Pa</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-mono">Overpressure</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${pressureStatus === 'Normal' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <Gauge className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Spec: {limits.pressure.normalMin} - {limits.pressure.normalMax} Pa</span>
            <span className="text-emerald-400 font-mono">Class A Protected</span>
          </div>
        </div>

        {/* Card 3: WFI Flow Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              WFI Circulation Flow
            </span>
            {getStatusBadge(flowStatus)}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {telemetry.flowRate}
                <span className="text-lg text-slate-400 font-sans ml-1">L/min</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <span>Setpoint: {limits.flowRate.setpoint} L/m</span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400 font-mono">Cooling Loop</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${flowStatus === 'Normal' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <Waves className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Spec: {limits.flowRate.normalMin} - {limits.flowRate.normalMax} L/m</span>
            <span className="text-blue-400 font-mono">Constant Velocity</span>
          </div>
        </div>

        {/* Card 4: Fault Tolerance Health Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fault Tolerance Health
            </span>
            <span className="text-[11px] font-mono font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30">
              TMR Quorum
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {telemetry.healthScore}
                <span className="text-lg text-slate-400 font-sans ml-0.5">%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <span>Heartbeat: {heartbeat} ticks</span>
                <span className="text-slate-600">•</span>
                <span className={telemetry.healthScore > 90 ? 'text-emerald-400' : 'text-amber-400'}>
                  {telemetry.healthScore > 90 ? 'Optimal Integrity' : 'Degraded (Absorbed)'}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${telemetry.healthScore > 90 ? 'bg-teal-500/10 text-teal-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sensor Concordance:</span>
            <span className="font-mono font-semibold text-teal-300">
              {telemetry.faultToleranceStatus === 'HEALTHY' ? '100% Concordance' : 'Fault Tolerated'}
            </span>
          </div>
        </div>

      </div>

      {/* Fault Tolerance Redundancy & TMR Engine Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-white text-base">
                Triple Modular Redundancy (TMR) Sensor Voting Architecture
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time 2-out-of-3 voting consensus isolates sensor drift and hardware failures to protect pharmaceutical batch integrity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Algorithm:</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-950 border border-teal-500/40 text-teal-300">
              {redundancyMode} (2-out-of-3)
            </span>
          </div>
        </div>

        {/* 3 Redundant Sensor Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Sensor A */}
          <div className={`p-4 rounded-xl border transition ${
            telemetry.sensorAStatus === 'ONLINE'
              ? 'bg-slate-950/70 border-slate-700/80'
              : 'bg-rose-950/40 border-rose-500/50 shadow-md shadow-rose-500/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-400" />
                Sensor A (RTD PT-100 Primary)
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                telemetry.sensorAStatus === 'ONLINE'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
              }`}>
                {telemetry.sensorAStatus}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {telemetry.sensorAStatus === 'DISCONNECTED' ? 'OFFLINE' : `${telemetry.tempA} °C`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              In-situ core immersion probe (Vessel Core Port 1)
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>Drift from Voted:</span>
              <span className="text-slate-300 font-semibold">
                {telemetry.sensorAStatus === 'DISCONNECTED' ? 'N/A' : `${(telemetry.tempA - telemetry.consensusTemp).toFixed(2)} °C`}
              </span>
            </div>
          </div>

          {/* Sensor B */}
          <div className={`p-4 rounded-xl border transition ${
            telemetry.sensorBStatus === 'ONLINE'
              ? 'bg-slate-950/70 border-slate-700/80'
              : 'bg-amber-950/40 border-amber-500/50 shadow-md shadow-amber-500/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Sensor B (RTD PT-100 Standby)
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                telemetry.sensorBStatus === 'ONLINE'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
              }`}>
                {telemetry.sensorBStatus}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {telemetry.tempB} °C
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Secondary redundant core probe (Vessel Core Port 2)
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>Drift from Voted:</span>
              <span className={Math.abs(telemetry.tempB - telemetry.consensusTemp) > 0.8 ? 'text-amber-400 font-bold' : 'text-slate-300 font-semibold'}>
                {(telemetry.tempB - telemetry.consensusTemp).toFixed(2)} °C
              </span>
            </div>
          </div>

          {/* Sensor C */}
          <div className={`p-4 rounded-xl border transition ${
            telemetry.sensorCStatus === 'ONLINE'
              ? 'bg-slate-950/70 border-slate-700/80'
              : 'bg-amber-950/40 border-amber-500/50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                Sensor C (IR Optical Pyrometer)
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                telemetry.sensorCStatus === 'ONLINE'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {telemetry.sensorCStatus}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {telemetry.tempC} °C
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Non-invasive infrared cleanroom optical pyrometer
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>Drift from Voted:</span>
              <span className="text-slate-300 font-semibold">
                {(telemetry.tempC - telemetry.consensusTemp).toFixed(2)} °C
              </span>
            </div>
          </div>

        </div>

        {/* Voting Engine Conclusion Message */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Active Quorum Verdict:
              </div>
              <div className="text-xs text-teal-300 font-mono mt-0.5">
                {telemetry.quorumDetails}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Consensus Output</span>
            <span className="text-xl font-mono font-bold text-emerald-400">
              {telemetry.consensusTemp} °C
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Fault Injection & Stress Testing Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Interactive Fault Injection & Redundancy Stress Test</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate real pharmaceutical hardware anomalies to verify continuous fault-tolerant failover:
            </p>
          </div>
          {simulatedFault !== 'NONE' && (
            <button
              onClick={() => setSimulatedFault('NONE')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to Nominal State
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setSimulatedFault('NONE')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              simulatedFault === 'NONE'
                ? 'bg-teal-950/70 border-teal-500/60 shadow-md shadow-teal-500/10'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-xs text-slate-200">1. Nominal State</div>
              <div className="text-[10px] text-slate-400 mt-1">3/3 sensors aligned within 0.15°C</div>
            </div>
            <span className="mt-2 text-[10px] font-mono text-emerald-400 font-bold">● Normal Mode</span>
          </button>

          <button
            onClick={() => setSimulatedFault('DRIFT_B')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              simulatedFault === 'DRIFT_B'
                ? 'bg-amber-950/70 border-amber-500/60 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-xs text-slate-200">2. Sensor B Drift (+4.8°C)</div>
              <div className="text-[10px] text-slate-400 mt-1">TMR isolates B, line keeps running</div>
            </div>
            <span className="mt-2 text-[10px] font-mono text-amber-400 font-bold">● Fault Tolerated</span>
          </button>

          <button
            onClick={() => setSimulatedFault('FAIL_A')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              simulatedFault === 'FAIL_A'
                ? 'bg-rose-950/70 border-rose-500/60 shadow-md shadow-rose-500/10'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-xs text-slate-200">3. Sensor A Disconnect</div>
              <div className="text-[10px] text-slate-400 mt-1">Auto-failover to B & C standby</div>
            </div>
            <span className="mt-2 text-[10px] font-mono text-rose-400 font-bold">● Auto Failover</span>
          </button>

          <button
            onClick={() => setSimulatedFault('TEMP_SPIKE')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              simulatedFault === 'TEMP_SPIKE'
                ? 'bg-rose-950/70 border-rose-500/60 shadow-md shadow-rose-500/10'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-xs text-slate-200">4. Chamber Overheat</div>
              <div className="text-[10px] text-slate-400 mt-1">True thermal excursion on all 3</div>
            </div>
            <span className="mt-2 text-[10px] font-mono text-rose-400 font-bold">● Critical Alarm</span>
          </button>

          <button
            onClick={() => setSimulatedFault('PRESSURE_DROP')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              simulatedFault === 'PRESSURE_DROP'
                ? 'bg-purple-950/70 border-purple-500/60 shadow-md shadow-purple-500/10'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-xs text-slate-200">5. Airlock Breach (Delta-P)</div>
              <div className="text-[10px] text-slate-400 mt-1">Pressure drops below 18.0 Pa</div>
            </div>
            <span className="mt-2 text-[10px] font-mono text-purple-400 font-bold">● Containment Alert</span>
          </button>
        </div>
      </div>

    </div>
  );
};
