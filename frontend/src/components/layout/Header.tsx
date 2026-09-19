import React from 'react';
import { Search, GitBranch, RefreshCw, Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentBranch?: string;
  onSyncGit?: () => void;
  user?: {
    name: string;
    role: string;
    avatar: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentBranch = 'main',
  onSyncGit,
  user = {
    name: 'Alex Rivera',
    role: 'Staff Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  }
}) => {
  return (
    <header className="h-14 border-b border-[#1c2333] px-6 flex items-center justify-between bg-[#0d121c]/90 backdrop-blur sticky top-0 z-20">
      {/* Global Search Bar & Branch Indicator */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Quick search PRs, branches, reviewers..." 
            className="w-full bg-[#141926] border border-[#222a3d] rounded-lg pl-9 pr-10 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          <kbd className="absolute right-2.5 top-2 text-[10px] text-slate-500 bg-[#0d111a] px-1.5 py-0.5 rounded border border-[#222a3d] font-mono">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141926] border border-[#222a3d] text-xs text-slate-300 font-mono cursor-pointer hover:border-slate-600 transition shrink-0">
          <GitBranch className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentBranch}</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </div>
      </div>

      {/* Action Buttons & User Profile */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onSyncGit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-[#222a3d] text-xs font-medium text-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Sync Git</span>
        </button>

        <button className="relative p-2 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-[#222a3d] text-slate-300 transition">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5"></span>
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1c2333]">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full border border-blue-500/40 object-cover"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-medium text-slate-200">{user.name}</div>
            <div className="text-[10px] text-slate-400">{user.role}</div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </div>
      </div>
    </header>
  );
};