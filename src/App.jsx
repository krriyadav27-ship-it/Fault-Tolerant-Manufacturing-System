import React, { useState } from 'react';
import { ProductionProvider, useProduction } from './context/ProductionContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/modules/LoginView';
import { DashboardView } from './components/modules/DashboardView';
import { ProductionMonitoringView } from './components/modules/ProductionMonitoringView';
import { LimitCheckingView } from './components/modules/LimitCheckingView';
import { HistoryTrendsView } from './components/modules/HistoryTrendsView';
import { StockManagementView } from './components/modules/StockManagementView';
import { AlertsView } from './components/modules/AlertsView';
import { ReportsView } from './components/modules/ReportsView';
import { SettingsView } from './components/modules/SettingsView';
import { X } from 'lucide-react';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'login':
        return <LoginView onLoginSuccess={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'monitoring':
        return <ProductionMonitoringView />;
      case 'limits':
        return <LimitCheckingView />;
      case 'history':
        return <HistoryTrendsView />;
      case 'stock':
        return <StockManagementView />;
      case 'alerts':
        return <AlertsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenLogin={() => setLoginModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLogin={() => setLoginModalOpen(true)}
        />

        {/* Central Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>
      </div>

      {/* Dedicated Login & Access Portal Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center shadow-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            <LoginView
              onClose={() => setLoginModalOpen(false)}
              onLoginSuccess={() => {
                setLoginModalOpen(false);
                setActiveTab('dashboard');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ProductionProvider>
      <AppContent />
    </ProductionProvider>
  );
}
