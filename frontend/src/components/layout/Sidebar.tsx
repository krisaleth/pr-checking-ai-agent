import React from 'react';
import { type ScreenTab } from '../../types/index';
import { 
  GitPullRequest, 
  Code2, 
  ShieldCheck, 
  BarChart3, 
  BookOpen, 
  Settings, 
  Terminal,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'queue' as ScreenTab, label: 'PR Queue', icon: GitPullRequest, badge: '12' },
    { id: 'workspace' as ScreenTab, label: 'Review Workspace', icon: Code2, badge: 'HIGH RISK', badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    { id: 'rules' as ScreenTab, label: 'Rules & Policies', icon: ShieldCheck },
    { id: 'analytics' as ScreenTab, label: 'Analytics & ROI', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#0d111a] border-r border-[#1e2536] flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#1e2536]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-wide text-white">ReviewPulse</h1>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-bold">V2.4 PRO</span>
            </div>
          </div>
        </div>

        {/* Repo Selector
        <div className="p-3">
          <div className="bg-[#141926] border border-[#222a3d] rounded-lg p-2 flex items-center justify-between text-xs cursor-pointer hover:border-slate-600 transition">
            <span className="text-slate-300 font-mono">org/payment-gateway</span>
            <span className="text-slate-500 text-[10px]">▼</span>
          </div>
        </div> */}

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          <p className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Workspaces</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-400 hover:bg-[#141926] hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-[#1e2536] space-y-2">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            AI Engine Online
          </span>
          <span className="font-mono text-emerald-400 text-[10px]">99.98%</span>
        </div>
        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#1e2536]/60 text-slate-400 text-[11px]">
          <button className="flex items-center gap-1 hover:text-white justify-center py-1"><BookOpen className="w-3.5 h-3.5" /> Docs</button>
          <button className="flex items-center gap-1 hover:text-white justify-center py-1"><Settings className="w-3.5 h-3.5" /> Config</button>
          <button className="flex items-center gap-1 hover:text-white justify-center py-1"><Terminal className="w-3.5 h-3.5" /> Logs</button>
        </div>
      </div>
    </aside>
  );
};