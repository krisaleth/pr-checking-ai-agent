import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PRReviewWorkspace } from './pages/PRReviewWorkspace';
import { PRQueueDashboard } from './pages/PRQueueDashboard';
import { AnalyticsInsights } from './pages/AnalyticsInsights';
import { RulePolicyConfig } from './pages/RulePolicyConfig';
import { type ScreenTab } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScreenTab>('rules');

  return (
    <div className="flex min-h-screen bg-[#0a0e16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Persistent Shell Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'queue' && (
          <PRQueueDashboard onNavigateToWorkspace={() => setActiveTab('workspace')} />
        )}
        {activeTab === 'workspace' && <PRReviewWorkspace />}
        {activeTab === 'rules' && <RulePolicyConfig />}
        {activeTab === 'analytics' && <AnalyticsInsights />}
      </main>
    </div>
  );
};

export default App;