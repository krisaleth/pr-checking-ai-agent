import React, { useState } from 'react';
import {
  Server,
  Database,
  Cpu,
  GitPullRequest,
  FolderGit2,
  Activity,
  Webhook,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  RotateCw,
  LogOut,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';

interface AIReviewItem {
  id: string;
  repo: string;
  prNumber: string;
  prTitle: string;
  status: 'Completed' | 'Running' | 'Failed';
  model: string;
  completedTime: string;
}

interface WebhookItem {
  id: string;
  event: string;
  action: string;
  repo: string;
  status: 'received' | 'processing' | 'processed';
  timestamp: string;
}

interface EventLogItem {
  id: string;
  type: 'info' | 'active' | 'success' | 'warn' | 'error';
  title: string;
  description: string;
  meta?: string;
  time: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activity'>('dashboard');
  const [filterModel, setFilterModel] = useState<string>('ALL');

  // Mock Recent AI Reviews
  const reviews: AIReviewItem[] = [
    {
      id: 'rev-1',
      repo: 'github-user/payment-service',
      prNumber: 'PR #42',
      prTitle: 'feat(auth): add OIDC',
      status: 'Completed',
      model: 'Claude 3.7 Sonnet',
      completedTime: '2m ago'
    },
    {
      id: 'rev-2',
      repo: 'dev-team/core-api',
      prNumber: 'PR #18',
      prTitle: 'fix(db): connection pool leak',
      status: 'Running',
      model: 'GPT-4o Code',
      completedTime: '15s ago'
    },
    {
      id: 'rev-3',
      repo: 'github-user/web-frontend',
      prNumber: 'PR #105',
      prTitle: 'refactor: tailwind migration',
      status: 'Completed',
      model: 'Claude 3.5 Haiku',
      completedTime: '12m ago'
    },
    {
      id: 'rev-4',
      repo: 'acme-corp/worker-queue',
      prNumber: 'PR #24',
      prTitle: 'chore: bump redis client',
      status: 'Failed',
      model: 'GPT-4o Code',
      completedTime: '34m ago'
    },
    {
      id: 'rev-5',
      repo: 'github-user/billing-service',
      prNumber: 'PR #89',
      prTitle: 'feat(stripe): webhook retry',
      status: 'Completed',
      model: 'Claude 3.7 Sonnet',
      completedTime: '1h ago'
    }
  ];

  // Mock Recent Webhooks
  const webhooks: WebhookItem[] = [
    {
      id: 'wh-1',
      event: 'pull_request',
      action: 'opened',
      repo: 'repo: payment-service',
      status: 'received',
      timestamp: '14:32:10'
    },
    {
      id: 'wh-2',
      event: 'pull_request',
      action: 'synchronize',
      repo: 'repo: core-api',
      status: 'processing',
      timestamp: '14:30:45'
    },
    {
      id: 'wh-3',
      event: 'pull_request',
      action: 'synchronize',
      repo: 'repo: web-frontend',
      status: 'processed',
      timestamp: '14:28:12'
    },
    {
      id: 'wh-4',
      event: 'pull_request',
      action: 'closed',
      repo: 'repo: infra-helm',
      status: 'received',
      timestamp: '14:15:00'
    },
    {
      id: 'wh-5',
      event: 'pr_review',
      action: 'submitted',
      repo: 'repo: worker-queue',
      status: 'processed',
      timestamp: '13:58:22'
    }
  ];

  // Mock Live Event Stream
  const eventLogs: EventLogItem[] = [
    {
      id: 'ev-1',
      type: 'info',
      title: 'Pull Request #42 received from github-user/payment-service',
      description: 'Automated diff analysis queued in worker tier (Worker node #04)',
      time: '14:32:10'
    },
    {
      id: 'ev-2',
      type: 'active',
      title: 'AI review started for PR #18 on dev-team/core-api',
      description: 'Model dispatch: GPT-4o Code • AST context loaded (4 changed files)',
      time: '14:30:45'
    },
    {
      id: 'ev-3',
      type: 'success',
      title: 'AI review completed for PR #105 (no critical vulnerabilities found)',
      description: 'Posted 2 inline suggestions on GitHub PR discussion thread',
      time: '14:28:12'
    },
    {
      id: 'ev-4',
      type: 'info',
      title: 'GitHub webhook processed for repo acme-corp/worker-queue',
      description: 'Event: pull_request.closed • State synchronized without comments',
      time: '14:15:00'
    },
    {
      id: 'ev-5',
      type: 'error',
      title: 'AI review failed on PR #24: timeout communicating with model API',
      description: 'HTTP 504 Gateway Timeout from remote inference provider endpoint',
      time: '13:58:22'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0d121d]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono font-bold text-base shadow-sm">
              &lt;/&gt;
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">PR Check AI Agent</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v2.4
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium block -mt-0.5">Admin Dashboard</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-[#131926] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Activity Log
            </button>
          </nav>
        </div>

        {/* Right Status & Profile Controls */}
        <div className="flex items-center gap-5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Operational • All systems normal
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-medium text-slate-200 block">alex.rivera@internal.corp</span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20 uppercase font-semibold">
                Admin
              </span>
            </div>
            <button
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Section 1: System Health (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Health Card 1: Server */}
          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Server</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">24ms • 99.98% up</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Health Card 2: Database */}
          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">PG Pool: 14/50 act</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {/* Health Card 3: AI Engine */}
          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Engine</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Configured
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">Claude 3.7 / GPT-4o</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          {/* Health Card 4: GitHub App */}
          <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 flex items-center justify-between hover:border-slate-700/80 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GitHub App</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">Webhook Active</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              <Webhook className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Section 2: Top Statistics (8 Cards - 2 Rows) */}
        <div className="space-y-3">
          {/* Row 1: Core Entity Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Repositories</span>
                <FolderGit2 className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">18 <span className="text-xs font-normal text-slate-400">monitored</span></div>
              <span className="text-xs text-slate-500 mt-1 block">Active GitHub repos</span>
            </div>

            <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Pull Requests</span>
                <GitPullRequest className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">142 <span className="text-xs font-normal text-slate-400">tracked</span></div>
              <span className="text-xs text-slate-500 mt-1 block">Across all branches</span>
            </div>

            <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">AI Reviews</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">328 <span className="text-xs font-medium text-emerald-400 font-mono">+24 today</span></div>
              <span className="text-xs text-slate-500 mt-1 block">Automated inspections run</span>
            </div>

            <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Webhooks</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">1,240 <span className="text-xs font-mono text-emerald-400">99.9% ack</span></div>
              <span className="text-xs text-slate-500 mt-1 block">Inbound events processed</span>
            </div>
          </div>

          {/* Row 2: Review Pipeline Execution States */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Completed */}
            <div className="bg-[#111724] border-l-4 border-l-emerald-500 border border-slate-800/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-300">Completed</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  92.4% rate
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">294</div>
              <span className="text-xs text-slate-500 mt-1 block">Successfully analyzed PRs</span>
            </div>

            {/* Running */}
            <div className="bg-[#111724] border-l-4 border-l-amber-500 border border-slate-800/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-300">Running</span>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  • Active
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">6</div>
              <span className="text-xs text-slate-500 mt-1 block">Currently in inference</span>
            </div>

            {/* Queued */}
            <div className="bg-[#111724] border-l-4 border-l-blue-500 border border-slate-800/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-300">Queued</span>
                <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  Worker pool
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">12</div>
              <span className="text-xs text-slate-500 mt-1 block">Awaiting analysis worker</span>
            </div>

            {/* Failed */}
            <div className="bg-[#111724] border-l-4 border-l-rose-500 border border-slate-800/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase text-slate-300">Failed</span>
                <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  4.8% err
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">16</div>
              <span className="text-xs text-slate-500 mt-1 block">Timeouts / API limits</span>
            </div>
          </div>
        </div>

        {/* Section 3: Two-Column Data Tables (Recent AI Reviews & Recent Webhooks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 Cols): Recent AI Reviews Table */}
          <div className="lg:col-span-8 bg-[#111724] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 md:px-5 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-white text-sm md:text-base">Recent AI Reviews</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time status of pull request evaluations</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-md border border-slate-700 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  Filter
                </button>
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1">
                  View all →
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#0d121d] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Repository</th>
                    <th className="py-3 px-4">Pull Request</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4 text-right">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-300">
                        {r.repo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{r.prNumber}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{r.prTitle}</div>
                      </td>
                      <td className="py-3 px-4">
                        {r.status === 'Completed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Completed
                          </span>
                        )}
                        {r.status === 'Running' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            Running
                          </span>
                        )}
                        {r.status === 'Failed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {r.model}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {r.completedTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column (4 Cols): Recent Webhooks Table */}
          <div className="lg:col-span-4 bg-[#111724] border border-slate-800/90 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <h3 className="font-bold text-white text-sm">Recent Webhooks</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">port: 443</span>
              </div>

              {/* Webhooks Feed List */}
              <div className="divide-y divide-slate-800/50 text-xs">
                {webhooks.map((wh) => (
                  <div key={wh.id} className="p-3.5 hover:bg-slate-800/30 transition-colors flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-200">{wh.event}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                          {wh.action}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block">{wh.repo}</span>
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded ${
                          wh.status === 'received'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : wh.status === 'processing'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {wh.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 block">{wh.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-slate-800/80 bg-[#0d121d]/50 text-center">
              <button className="text-xs text-slate-400 hover:text-white transition-colors">
                View webhook delivery stream →
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Live Agent Event Stream (Activity Log) */}
        <div className="bg-[#111724] border border-slate-800/90 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-white text-sm">Live Agent Event Stream</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Showing last 5 events</span>
          </div>

          <div className="space-y-3">
            {eventLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between gap-4 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      log.type === 'error'
                        ? 'bg-rose-400'
                        : log.type === 'active'
                        ? 'bg-amber-400'
                        : log.type === 'success'
                        ? 'bg-emerald-400'
                        : 'bg-blue-400'
                    }`}
                  />
                  <div>
                    <p className="text-slate-200 font-sans font-medium">{log.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{log.description}</p>
                  </div>
                </div>
                <span className="text-slate-500 text-[11px] flex-shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Admin Footer Console */}
      <footer className="h-10 border-t border-slate-800/80 bg-[#0d121d] px-6 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div>PR Check AI Agent • Developer Admin Console</div>
        <div className="flex items-center gap-4">
          <span>Worker Pool: 8/8 Online</span>
          <span>API Latency: 24ms</span>
          <span className="text-slate-500">build #8941a</span>
        </div>
      </footer>
    </div>
  );
};