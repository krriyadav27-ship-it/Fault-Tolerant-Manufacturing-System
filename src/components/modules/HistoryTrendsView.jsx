import React, { useState, useMemo } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  TrendingUp,
  History,
  FileText,
  Thermometer,
  Gauge,
  Waves,
  Clock,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  Calendar
} from 'lucide-react';
import { SHIFTS } from '../../data/mockData';

export const HistoryTrendsView = () => {
  const {
    readingsHistory,
    shiftLogs,
    addShiftLog,
    limits,
    currentUser,
    batchInfo
  } = useProduction();

  const [activeSubTab, setActiveSubTab] = useState('graphs'); // 'graphs' | 'readings' | 'shiftLogs'
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [activeChartMetric, setActiveChartMetric] = useState('temperature'); // 'temperature' | 'sensors' | 'pressure'
  const [searchTerm, setSearchTerm] = useState('');

  // Shift handover modal state
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftForm, setShiftForm] = useState({
    shift: SHIFTS[0].name,
    handoverSummary: 'Thermal profile within validated boundaries. Cleanroom positive pressure maintained. Handing over with zero pending alarms.',
    deviationsCount: 0
  });

  // Prepare chronological data for charts
  const chartData = useMemo(() => {
    const list = [...readingsHistory].reverse();
    return list;
  }, [readingsHistory]);

  const handleShiftSubmit = (e) => {
    e.preventDefault();
    addShiftLog({
      shift: shiftForm.shift,
      readingsLogged: readingsHistory.length,
      handoverSummary: shiftForm.handoverSummary,
      deviationsCount: parseInt(shiftForm.deviationsCount) || 0
    });
    setShowShiftModal(false);
  };

  // SVG Chart Helper
  const renderSvgTemperatureChart = () => {
    if (chartData.length < 2) {
      return (
        <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
          Not enough historical points recorded yet.
        </div>
      );
    }

    const width = 800;
    const height = 280;
    const padding = { top: 30, right: 30, bottom: 40, left: 55 };

    const minTemp = 18.0;
    const maxTemp = 28.0;

    const scaleX = (index) =>
      padding.left + (index / (chartData.length - 1)) * (width - padding.left - padding.right);

    const scaleY = (val) =>
      height - padding.bottom - ((val - minTemp) / (maxTemp - minTemp)) * (height - padding.top - padding.bottom);

    // Points for consensus temp
    const consensusPoints = chartData
      .map((d, i) => `${scaleX(i)},${scaleY(d.consensusTemp)}`)
      .join(' ');

    // Area polygon
    const areaPoints = `${scaleX(0)},${scaleY(minTemp)} ${consensusPoints} ${scaleX(chartData.length - 1)},${scaleY(minTemp)}`;

    return (
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72">
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[20, 22, 24, 26].map((temp) => (
            <g key={temp}>
              <line
                x1={padding.left}
                y1={scaleY(temp)}
                x2={width - padding.right}
                y2={scaleY(temp)}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={scaleY(temp) + 4}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {temp}°C
              </text>
            </g>
          ))}

          {/* Warning High Limit line */}
          <line
            x1={padding.left}
            y1={scaleY(limits.temperature.warningHigh)}
            x2={width - padding.right}
            y2={scaleY(limits.temperature.warningHigh)}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />
          <text
            x={width - padding.right}
            y={scaleY(limits.temperature.warningHigh) - 6}
            fill="#f59e0b"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            Warning High ({limits.temperature.warningHigh}°C)
          </text>

          {/* Target Setpoint line */}
          <line
            x1={padding.left}
            y1={scaleY(limits.temperature.setpoint)}
            x2={width - padding.right}
            y2={scaleY(limits.temperature.setpoint)}
            stroke="#10b981"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <text
            x={width - padding.right}
            y={scaleY(limits.temperature.setpoint) - 6}
            fill="#10b981"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            Target Setpoint ({limits.temperature.setpoint}°C)
          </text>

          {/* Area Fill */}
          <polygon points={areaPoints} fill="url(#tempGradient)" />

          {/* Consensus Trend Line */}
          <polyline
            fill="none"
            stroke="#14b8a6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={consensusPoints}
          />

          {/* Data Points */}
          {chartData.map((d, i) => {
            const cx = scaleX(i);
            const cy = scaleY(d.consensusTemp);
            const isWarn = d.status !== 'Normal';
            return (
              <g key={d.id} className="cursor-pointer group">
                <circle
                  cx={cx}
                  cy={cy}
                  r={isWarn ? 5 : 3.5}
                  fill={isWarn ? '#f43f5e' : '#0f766e'}
                  stroke={isWarn ? '#ffe4e6' : '#2dd4bf'}
                  strokeWidth="2"
                />
                <title>{`${d.timestamp}\nConsensus: ${d.consensusTemp}°C\nStatus: ${d.status}\nOperator: ${d.operator}`}</title>
              </g>
            );
          })}

          {/* X Axis Time Labels */}
          {chartData.map((d, i) => {
            if (i % 3 === 0 || i === chartData.length - 1) {
              return (
                <text
                  key={`time-${i}`}
                  x={scaleX(i)}
                  y={height - 12}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {d.timestamp.split(' ')[1] || d.timestamp}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>
    );
  };

  // Multi-Sensor Comparison Chart
  const renderSvgMultiSensorChart = () => {
    if (chartData.length < 2) return null;

    const width = 800;
    const height = 280;
    const padding = { top: 30, right: 30, bottom: 40, left: 55 };

    const minTemp = 18.0;
    const maxTemp = 28.0;

    const scaleX = (index) =>
      padding.left + (index / (chartData.length - 1)) * (width - padding.left - padding.right);

    const scaleY = (val) =>
      height - padding.bottom - ((val - minTemp) / (maxTemp - minTemp)) * (height - padding.top - padding.bottom);

    const ptsA = chartData.map((d, i) => `${scaleX(i)},${scaleY(d.tempA)}`).join(' ');
    const ptsB = chartData.map((d, i) => `${scaleX(i)},${scaleY(d.tempB)}`).join(' ');
    const ptsC = chartData.map((d, i) => `${scaleX(i)},${scaleY(d.tempC)}`).join(' ');
    const ptsConsensus = chartData.map((d, i) => `${scaleX(i)},${scaleY(d.consensusTemp)}`).join(' ');

    return (
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72">
          {/* Grid lines */}
          {[20, 22, 24, 26].map((temp) => (
            <g key={temp}>
              <line
                x1={padding.left}
                y1={scaleY(temp)}
                x2={width - padding.right}
                y2={scaleY(temp)}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={scaleY(temp) + 4}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {temp}°C
              </text>
            </g>
          ))}

          {/* Sensor A: Cyan */}
          <polyline fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" points={ptsA} />

          {/* Sensor B: Amber */}
          <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" points={ptsB} />

          {/* Sensor C: Indigo */}
          <polyline fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2 2" points={ptsC} />

          {/* Voted Consensus: Solid Emerald Thick */}
          <polyline fill="none" stroke="#10b981" strokeWidth="3" points={ptsConsensus} />

          {/* X Axis Time Labels */}
          {chartData.map((d, i) => {
            if (i % 3 === 0 || i === chartData.length - 1) {
              return (
                <text
                  key={`time-s-${i}`}
                  x={scaleX(i)}
                  y={height - 12}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {d.timestamp.split(' ')[1] || d.timestamp}
                </text>
              );
            }
            return null;
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-cyan-400 border-b border-dashed border-cyan-400" />
            <span className="text-cyan-400">Sensor A (PT-100 Core)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400 border-b border-dashed border-amber-400" />
            <span className="text-amber-400">Sensor B (PT-100 Standby)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-purple-400 border-b border-dashed border-purple-400" />
            <span className="text-purple-400">Sensor C (IR Optical)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-emerald-400 rounded-full" />
            <span className="text-emerald-400 font-bold">Voted Consensus Output</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Module 5: History & Trends Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Process Kinetics, Historical Archive & Shift Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Analyze historical thermal trends, multi-sensor concordance curves, and formal shift turnover handover records.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('graphs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'graphs'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trends & Charts
          </button>
          <button
            onClick={() => setActiveSubTab('readings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'readings'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Readings Archive ({readingsHistory.length})
          </button>
          <button
            onClick={() => setActiveSubTab('shiftLogs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'shiftLogs'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shift Handover Logs ({shiftLogs.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: GRAPHS & TRENDS */}
      {activeSubTab === 'graphs' && (
        <div className="space-y-6">
          
          {/* Chart Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                Metric View:
              </span>
              <button
                onClick={() => setActiveChartMetric('temperature')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeChartMetric === 'temperature'
                    ? 'bg-teal-950 border border-teal-500/50 text-teal-300 font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Temperature vs Limits
              </button>
              <button
                onClick={() => setActiveChartMetric('sensors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeChartMetric === 'sensors'
                    ? 'bg-teal-950 border border-teal-500/50 text-teal-300 font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Multi-Sensor TMR Comparison (Sensors A, B, C)
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Time Window:</span>
              {['6h', '12h', '24h', 'All'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md font-mono ${
                    selectedTimeframe === tf
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Main Chart Canvas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base">
                  {activeChartMetric === 'temperature'
                    ? 'Consensus Core Temperature vs Regulatory Limits (°C)'
                    : 'Fault-Tolerant Multi-Sensor Redundancy Concordance Graph'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeChartMetric === 'temperature'
                    ? 'Batch thermal profile mapped against upper/lower specification limits.'
                    : 'Shows how individual sensor fluctuations are rejected by the 2-out-of-3 voting engine.'}
                </p>
              </div>
              <span className="text-xs font-mono text-teal-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                {batchInfo.id}
              </span>
            </div>

            {activeChartMetric === 'temperature'
              ? renderSvgTemperatureChart()
              : renderSvgMultiSensorChart()}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: READINGS ARCHIVE */}
      {activeSubTab === 'readings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Historical Production Database</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Archived logs with operator digital stamps and TMR consensus values.
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search batch, operator, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 pl-9 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 w-64"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Entry ID</th>
                  <th className="py-3 px-3">Date/Time</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Line</th>
                  <th className="py-3 px-3">Sensor A/B/C</th>
                  <th className="py-3 px-3">Voted Temp</th>
                  <th className="py-3 px-3">Pressure</th>
                  <th className="py-3 px-3">Flow</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {readingsHistory
                  .filter((r) =>
                    searchTerm
                      ? r.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.id.toLowerCase().includes(searchTerm.toLowerCase())
                      : true
                  )
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-teal-400 font-semibold">{r.id}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{r.timestamp}</td>
                      <td className="py-3 px-3 text-slate-300">{r.batchId}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{r.line.split(' - ')[1] || r.line}</td>
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
      )}

      {/* SUB-TAB 3: SHIFT TURNOVER & HANDOVER LOGS */}
      {activeSubTab === 'shiftLogs' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">
                  Cleanroom Shift Turnover & Handover Ledger
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Formal shift transition records detailing average conditions, critical deviations, and outgoing operator sign-offs.
                </p>
              </div>
              <button
                onClick={() => setShowShiftModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-500/20 transition self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Shift Turnover Log</span>
              </button>
            </div>

            <div className="space-y-4">
              {shiftLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-950 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{log.shift}</span>
                          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900">
                            {log.date}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Lead Operator: <strong className="text-slate-200">{log.leadOperator}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">Readings: </span>
                        <span className="text-slate-200">{log.readingsLogged}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Mean Temp: </span>
                        <span className="text-teal-300 font-bold">{log.meanTemp}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Deviations: </span>
                        <span className={log.deviationsCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {log.deviationsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    "{log.handoverSummary}"
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 font-mono">
                      <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
                      Electronically Signed: {log.signedAt}
                    </span>
                    <span className="text-slate-400">
                      QA Status: <strong className="text-emerald-400 font-semibold">{log.verifiedBy}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shift Log Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Create Shift Turnover Handover</h3>
            <p className="text-xs text-slate-400 mb-5">
              Document shift summary statistics and execute electronic handover under 21 CFR Part 11.
            </p>

            <form onSubmit={handleShiftSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Shift Description
                </label>
                <select
                  value={shiftForm.shift}
                  onChange={(e) => setShiftForm({ ...shiftForm, shift: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
                >
                  {SHIFTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Handover Summary Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={shiftForm.handoverSummary}
                  onChange={(e) => setShiftForm({ ...shiftForm, handoverSummary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Deviations / Anomalies Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={shiftForm.deviationsCount}
                  onChange={(e) => setShiftForm({ ...shiftForm, deviationsCount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Sign & Submit Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
