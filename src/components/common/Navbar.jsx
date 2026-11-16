import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Volume2,
  VolumeX,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  Radio
} from 'lucide-react';

export const Navbar = ({ onOpenLogin, activeTab, setActiveTab }) => {
  const {
    currentUser,
    users,
    switchUser,
    logout,
    telemetry,
    batchInfo,
    isMuted,
    toggleAudio,
    activeAlertsCount,
    simulatedFault,
    setSimulatedFault
  } = useProduction();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isDegraded = telemetry.faultToleranceStatus !== 'HEALTHY';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Batch Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-teal-300 bg-clip-text text-transparent">
                  PharmaPulse
                </span>
                <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-teal-950 border border-teal-500/30 text-teal-300 font-semibold">
                  FT-2000
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                GMP 21 CFR Part 11 Production Monitoring
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Active Batch Indicator */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-xs">
              <span className="text-slate-400">Active Batch: </span>
              <span className="font-mono font-semibold text-slate-200">{batchInfo.id}</span>
              <span className="text-slate-400 ml-1.5 text-[11px] hidden xl:inline">({batchInfo.productName.split(' ')[0]})</span>
            </div>
          </div>
        </div>

        {/* Center: Fault-Tolerance Status Pill */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
          <Radio className={`w-3.5 h-3.5 ${isDegraded ? 'text-amber-400 animate-bounce' : 'text-emerald-400 animate-pulse'}`} />
          <span className="text-xs font-mono font-medium text-slate-300">
            Redundancy:
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isDegraded
                ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
            }`}
          >
            {telemetry.faultToleranceStatus}
          </span>
          {simulatedFault !== 'NONE' && (
            <button
              onClick={() => setSimulatedFault('NONE')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium ml-1"
              title="Reset simulated fault back to nominal"
            >
              Reset Fault
            </button>
          )}
        </div>

        {/* Right: Audio Toggle, Alert Bell, User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-teal-950/40 border-teal-500/40 text-teal-300 shadow-sm shadow-teal-500/10'
            }`}
            title={isMuted ? 'Unmute Audio Alarms' : 'Mute Audio Alarms'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Alerts Pill */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`relative p-2 rounded-lg border transition-all ${
              activeAlertsCount > 0
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="View Active Alerts"
          >
            <ShieldAlert className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* User Account & Quick Switcher */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  {currentUser.avatar}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-400 font-mono">
                    {currentUser.role} • {currentUser.badgeId}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Current Operator
                    </p>
                    <p className="font-semibold text-slate-100 text-sm mt-0.5">{currentUser.name}</p>
                    <p className="text-teal-400 font-mono text-[11px]">{currentUser.title}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {currentUser.cleanroomGrade}
                    </span>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                      Switch Role (Demo Mode):
                    </p>
                    <div className="space-y-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition ${
                            u.id === currentUser.id
                              ? 'bg-teal-950/60 border border-teal-500/30 text-teal-300'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.role}</div>
                          </div>
                          {u.id === currentUser.id && (
                            <span className="text-[10px] text-teal-400 font-bold">Active</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800 px-2 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Manage User Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-rose-950/50 text-rose-300 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
