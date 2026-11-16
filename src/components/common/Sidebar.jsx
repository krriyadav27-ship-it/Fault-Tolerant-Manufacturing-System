import React from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  LayoutDashboard,
  ClipboardPenLine,
  SlidersHorizontal,
  TrendingUp,
  Boxes,
  Bell,
  FileSpreadsheet,
  Settings,
  LogIn,
  ShieldCheck,
  Cpu,
  RefreshCw,
  HeartPulse
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const {
    currentUser,
    activeAlertsCount,
    telemetry,
    heartbeat,
    setSimulatedFault,
    simulatedFault
  } = useProduction();

  const navItems = [
    { id: 'dashboard', label: '2. Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'monitoring', label: '3. Production Monitoring', icon: ClipboardPenLine, badge: null },
    { id: 'limits', label: '4. Limit Checking', icon: SlidersHorizontal, badge: null },
    { id: 'history', label: '5. History & Trends', icon: TrendingUp, badge: null },
    { id: 'stock', label: '6. Stock Management', icon: Boxes, badge: null },
    {
      id: 'alerts',
      label: '7. Alerts',
      icon: Bell,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'reports', label: '8. Reports', icon: FileSpreadsheet, badge: null },
    { id: 'settings', label: '9. Settings', icon: Settings, badge: null }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      
      {/* Top Section: Quick Auth / Module 1 Link */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={onOpenLogin}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-slate-200 text-xs font-medium transition group"
        >
          <div className="flex items-center gap-2.5">
            <LogIn className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            <span>1. Login / Access Portal</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900">
            {currentUser?.role || 'Guest'}
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Manufacturing Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600/30 to-cyan-600/10 border border-teal-500/50 text-teal-300 font-semibold shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Redundancy Core & TMR Hardware Monitor */}
      <div className="p-3 m-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>TMR Fault Engine</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono text-slate-400">HB:{heartbeat % 100}</span>
          </div>
        </div>

        <div className="space-y-1 text-[11px] font-mono">
          <div className="flex justify-between items-center text-slate-400">
            <span>Sensor A (PT-100):</span>
            <span className={telemetry.sensorAStatus === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
              {telemetry.sensorAStatus === 'ONLINE' ? `${telemetry.tempA}°C` : telemetry.sensorAStatus}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Sensor B (PT-100):</span>
            <span className={telemetry.sensorBStatus === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
              {telemetry.sensorBStatus === 'ONLINE' ? `${telemetry.tempB}°C` : telemetry.sensorBStatus}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Sensor C (IR-Optic):</span>
            <span className={telemetry.sensorCStatus === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
              {telemetry.sensorCStatus === 'ONLINE' ? `${telemetry.tempC}°C` : telemetry.sensorCStatus}
            </span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-400">Consensus Temp:</span>
          <span className="font-bold text-teal-300 font-mono text-xs">{telemetry.consensusTemp}°C</span>
        </div>

        {simulatedFault !== 'NONE' && (
          <button
            onClick={() => setSimulatedFault('NONE')}
            className="w-full mt-2 py-1 px-2 rounded bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 font-semibold text-[10px] flex items-center justify-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Active Fault
          </button>
        )}
      </div>

    </aside>
  );
};
