import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Thermometer,
  Boxes,
  Calendar,
  Volume2,
  VolumeX,
  FileCheck2,
  Sparkles,
  Search,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';

export const AlertsView = () => {
  const {
    alerts,
    acknowledgeAlert,
    resolveAlert,
    triggerNewAlert,
    activeAlertsCount,
    isMuted,
    toggleAudio,
    currentUser
  } = useProduction();

  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Temperature' | 'Stock' | 'Active' | 'Resolved'
  const [selectedAlertForResolve, setSelectedAlertForResolve] = useState(null);
  const [capaText, setCapaText] = useState('Cleaned and recalibrated sensor probe. Verified concordance with reference pyrometer.');

  // Simulated Test Alert generator
  const triggerDemoAlert = (category) => {
    if (category === 'temp') {
      triggerNewAlert({
        type: 'Temperature',
        severity: 'Critical',
        title: 'Thermal Upper Limit Breach (+26.8°C)',
        message: 'Reactor 101-A jacket circulation sensor detected thermal spike beyond Upper Specification Limit (25.5°C).',
        source: 'Automated Thermal Controller'
      });
    } else if (category === 'stock') {
      triggerNewAlert({
        type: 'Stock',
        severity: 'Warning',
        title: 'API Depletion Threshold Alert',
        message: 'Amoxicillin Trihydrate API stock fell below minimum buffer threshold of 150 kg.',
        source: 'Inventory Reorder Daemon'
      });
    } else if (category === 'expiry') {
      triggerNewAlert({
        type: 'Stock',
        severity: 'Critical',
        title: 'Critical Expiry: Cold-Chain Reagent',
        message: 'HEPES Buffer Lot LOT-HEP-2025-99 reaches statutory expiration within 48 hours. Batch release block applied.',
        source: 'Cold Chain Expiry Monitor'
      });
    }
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!selectedAlertForResolve) return;
    resolveAlert(selectedAlertForResolve.id, capaText);
    setSelectedAlertForResolve(null);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'Active') return a.status === 'Active';
    if (filterType === 'Resolved') return a.status === 'Resolved';
    if (filterType === 'Temperature') return a.type === 'Temperature' || a.type === 'Process';
    if (filterType === 'Stock') return a.type === 'Stock';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Module 7: Centralized Alarm & Event Dispatcher</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Temperature, Stock & Expiry Alarm Console
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time event notification center featuring 21 CFR Part 11 electronic acknowledgment and CAPA closure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              isMuted
                ? 'bg-slate-800 border-slate-700 text-slate-400'
                : 'bg-teal-950 border-teal-500/40 text-teal-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'Alarms Muted' : 'Alarm Chimes Active'}</span>
          </button>
        </div>
      </div>

      {/* Quick Trigger Simulation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase text-slate-300">
            Simulate Alarm Triggers:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerDemoAlert('temp')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-medium hover:bg-rose-900/80 transition"
          >
            + Temp Excursion Alert
          </button>
          <button
            onClick={() => triggerDemoAlert('stock')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-900/80 transition"
          >
            + Low Stock Alert
          </button>
          <button
            onClick={() => triggerDemoAlert('expiry')}
            className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-900/80 transition"
          >
            + Material Expiry Alert
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'ALL', label: `All Alerts (${alerts.length})` },
          { id: 'Active', label: `Active Unacknowledged (${alerts.filter(a => a.status === 'Active').length})` },
          { id: 'Temperature', label: 'Temperature & Process' },
          { id: 'Stock', label: 'Stock & Expiry' },
          { id: 'Resolved', label: 'Resolved (Closed)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition ${
              filterType === tab.id
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
            <h4 className="text-slate-300 font-semibold text-sm">No alarms matching filter</h4>
            <p className="text-xs text-slate-500 mt-1">All cleanroom conditions are currently operating nominally.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'Critical';
            const isWarn = alert.severity === 'Warning';
            const isActive = alert.status === 'Active';
            const isAck = alert.status === 'Acknowledged';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isActive && isCrit
                    ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-500/10'
                    : isActive && isWarn
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Icon & Content */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCrit
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                          : isWarn
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}
                    >
                      {alert.type === 'Temperature' ? (
                        <Thermometer className="w-5 h-5" />
                      ) : alert.type === 'Stock' ? (
                        <Boxes className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-400">{alert.id}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                            isCrit
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-500">[{alert.type} Alarm]</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                      </div>

                      <h3 className="text-base font-bold text-white mt-1">
                        {alert.title}
                      </h3>

                      <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="mt-2 text-[11px] text-slate-500 font-mono">
                        Source Subsystem: <strong className="text-slate-400">{alert.source}</strong>
                      </div>

                      {/* Resolution note if resolved */}
                      {alert.resolution && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs">
                          <span className="text-emerald-400 font-semibold font-mono block mb-0.5">
                            ✓ CAPA Corrective Action Taken:
                          </span>
                          <span className="text-slate-300">{alert.resolution}</span>
                        </div>
                      )}

                      {/* Acknowledged tag */}
                      {alert.acknowledgedBy && !alert.resolution && (
                        <div className="mt-2 text-[11px] text-teal-400 font-mono flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Acknowledged by {alert.acknowledgedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 self-end md:self-auto">
                    {isActive && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => setSelectedAlertForResolve(alert)}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Resolve (CAPA)</span>
                      </button>
                    )}

                    {alert.status === 'Resolved' && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CAPA Resolution Modal */}
      {selectedAlertForResolve && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              File CAPA & Resolve Alarm
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Alert: <strong className="text-teal-300">{selectedAlertForResolve.title}</strong> ({selectedAlertForResolve.id})
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Corrective & Preventive Action (CAPA) Documented Action:
                </label>
                <textarea
                  rows={4}
                  required
                  value={capaText}
                  onChange={(e) => setCapaText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Authorizing Operator: <strong className="text-slate-200">{currentUser?.name}</strong> ({currentUser?.badgeId})
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForResolve(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Submit CAPA & Close Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
