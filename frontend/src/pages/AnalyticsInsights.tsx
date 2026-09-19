import React, { useState } from 'react';
import { 
  Calendar, 
  FolderGit2, 
  Download, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  Hash
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/shared/Badge';
import { Button } from '../components/shared/Button';

export const AnalyticsInsights: React.FC = () => {
  const [timeRange] = useState('Last 30 Days');
  const [selectedRepo] = useState('All Repositories (14)');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0a0e16] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. Header Dùng Chung */}
      <Header />

      {/* 2. Top Title & Filter Controls */}
      <div className="p-6 pb-2 max-w-7xl w-full mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="safe" pulse={true}>TELEMETRY STREAM V2.4 • CLUSTER ALPHA</Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              AI Code Review Analytics & Engineering Velocity
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Measure review turnaround time reduction, defect prevention rate, and AI assistant adoption across 42 developers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141926] border border-[#222a3d] text-xs font-medium text-slate-300 cursor-pointer hover:border-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeRange}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141926] border border-[#222a3d] text-xs font-medium text-slate-300 cursor-pointer hover:border-slate-600">
              <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedRepo}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>

            <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5 text-slate-400" />}>
              Executive Report
            </Button>
            <Button variant="primary" size="sm" icon={<Bell className="w-3.5 h-3.5" />}>
              Schedule Digest
            </Button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Card 1 */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Velocity Core</span>
              <Badge variant="safe" size="sm">↓ 81%</Badge>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono text-white">4.2</span>
              <span className="text-xs text-slate-400">hrs</span>
            </div>
            <p className="text-[11px] text-slate-400">Average Time-to-Merge</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quality Shield</span>
              <Badge variant="critical" size="sm">PRE-PROD</Badge>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono text-white">148</span>
              <span className="text-xs text-slate-400">bugs</span>
            </div>
            <p className="text-[11px] text-slate-400">Caught Before Main Branch</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trust Alignment</span>
              <Badge variant="purple" size="sm">HIGH FIT</Badge>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono text-white">86.4</span>
              <span className="text-xs text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-400">AI Suggestion Acceptance</p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capital Value</span>
              <Badge variant="safe" size="sm">ROI YIELD</Badge>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono text-emerald-400">~380</span>
              <span className="text-xs text-slate-400">hrs</span>
            </div>
            <p className="text-[11px] text-slate-400">Reclaimed / Mo ($45,600 value)</p>
          </div>
        </div>

        {/* Trend Graph & Defect Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Trend */}
          <div className="lg:col-span-8 bg-[#111622] border border-[#1e2538] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">PR Cycle Time Trend</h3>
            <div className="w-full h-64 relative pt-4">
              <svg className="w-full h-full" viewBox="0 0 700 220" preserveAspectRatio="none">
                <path d="M 60 90 C 140 120, 200 150, 280 160 C 360 170, 460 178, 540 182 C 600 184, 630 185, 660 186" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Defect Donut */}
          <div className="lg:col-span-4 bg-[#111622] border border-[#1e2538] rounded-xl p-5 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white">Defect Distribution</h3>
            <div className="text-center py-6">
              <span className="text-4xl font-black font-mono text-white">148</span>
              <span className="text-xs text-slate-400 block mt-1">Interceptions</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300"><span>Auth & AuthZ</span><span className="font-mono">32%</span></div>
              <div className="flex justify-between text-slate-300"><span>Database & Queries</span><span className="font-mono">28%</span></div>
              <div className="flex justify-between text-slate-300"><span>Concurrency</span><span className="font-mono">22%</span></div>
            </div>
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-5 space-y-4 mb-12">
          <h3 className="text-sm font-bold text-white">Team Adoption & Impact Leaderboard</h3>
          <div className="divide-y divide-[#171e2e] text-xs">
            <div className="grid grid-cols-12 items-center py-2.5 px-2">
              <div className="col-span-6 flex items-center gap-2.5">
                <span className="font-mono text-slate-500 font-bold">01</span>
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Elena" className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-slate-200">Elena Rostova</div>
                  <div className="text-[10px] text-slate-500">Core Infra Lead</div>
                </div>
              </div>
              <span className="col-span-2 text-right font-mono text-slate-300 font-bold">114 patches</span>
              <span className="col-span-2 text-right font-mono text-emerald-400 font-bold">4.1x speedup</span>
              <div className="col-span-2 text-right font-mono text-emerald-400 font-bold">98.2% accuracy</div>
            </div>
          </div>

          {/* Slack Alert Banner (Sử dụng Hash Icon) */}
          <div className="bg-[#141824] border border-[#222a3d] rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Hash className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-200 block">Weekly Digest Scheduled</span>
                <span className="text-slate-400 text-[11px]">Channel: <code className="text-purple-300 font-mono">#eng-velocity-alerts</code></span>
              </div>
            </div>
            <Button variant="ghost" size="sm">Configure Webhook</Button>
          </div>
        </div>

      </div>
    </div>
  );
};