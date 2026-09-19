import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  ChevronDown, 
  Sparkles, 
  GitBranch, 
  Clock, 
  Flame, 
  Layers, 
  LayoutGrid, 
  List, 
  ExternalLink,
  Activity
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/shared/Badge';
import { Button } from '../components/shared/Button';

interface PRQueueDashboardProps {
  onNavigateToWorkspace?: () => void;
}

export const PRQueueDashboard: React.FC<PRQueueDashboardProps> = ({ onNavigateToWorkspace }) => {
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'CRITICAL' | 'MEDIUM' | 'SAFE'>('ALL');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0a0e16] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. Header Dùng Chung */}
      <Header />

      {/* 2. Main Content Viewport */}
      <div className="p-6 space-y-6 max-w-7xl w-full mx-auto pb-16">
        
        {/* Row 1: KPI Telemetry Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Open PRs */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Open Pull Requests</span>
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold font-mono text-white">14</span>
              <span className="text-xs text-slate-400 font-sans">active tracks</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-[11px]">
              <div className="bg-red-500/15 border border-red-500/30 text-red-400 py-1 rounded">
                <span className="font-bold">3</span> <span className="text-[9px] block">High Risk</span>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/40 text-slate-300 py-1 rounded">
                <span className="font-bold">8</span> <span className="text-[9px] block">Normal</span>
              </div>
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 py-1 rounded">
                <span className="font-bold">3</span> <span className="text-[9px] block">Ready</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Review Velocity */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Review Velocity</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-mono text-white">1.8</span>
                <span className="text-xs text-slate-400 font-sans">mins</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-medium flex items-center">
                ↓ 74% faster
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-[10px]">
                <Clock className="w-3 h-3 text-slate-500" /> Benchmark: 42 mins human SLA
              </span>
            </div>
            <div className="h-4 w-full mt-2">
              <svg className="w-full h-full stroke-emerald-400 fill-none" viewBox="0 0 100 20">
                <path d="M0 16 L20 14 L40 17 L60 9 L80 11 L100 4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* KPI 3: Critical Flaws */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Critical Flaws</span>
              <ShieldAlert className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">29</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">THIS WEEK</span>
            </div>
            <div className="flex items-center gap-4 text-xs mt-2 text-slate-300">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span> 11 Security</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 18 Perf</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-gradient-to-r from-red-500 to-blue-500 h-full w-3/4"></div>
            </div>
          </div>

          {/* KPI 4: Test Coverage */}
          <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Coverage Delta</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-emerald-400">+4.2%</span>
              <span className="text-xs font-mono text-slate-400">88.6% Total</span>
            </div>
            <div className="text-xs text-slate-300 mt-2 flex items-center justify-between">
              <span>Tests Synthesized: <strong className="font-mono text-white">148</strong></span>
              <span className="text-emerald-400 text-[10px]">0 regressions</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-emerald-500 h-full w-[88%]"></div>
            </div>
          </div>
        </section>

        {/* Row 2: Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0e131e] p-2.5 rounded-xl border border-[#1c2336]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#141926] border border-[#222a3d] rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-300 hover:border-slate-600">
              <span>All Repositories</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="h-5 w-[1px] bg-slate-800 mx-1 hidden sm:block"></div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center bg-[#141926] p-0.5 rounded-lg border border-[#222a3d] text-xs">
              {(['ALL', 'CRITICAL', 'MEDIUM', 'SAFE'] as const).map((risk) => (
                <button
                  key={risk}
                  onClick={() => setFilterRisk(risk)}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    filterRisk === risk 
                      ? 'bg-[#20293d] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {risk === 'CRITICAL' ? 'CRITICAL / HIGH (3)' : risk}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center bg-[#141926] border border-[#222a3d] rounded-lg p-1 text-slate-400">
              <button className="p-1 rounded bg-[#20293d] text-white"><LayoutGrid className="w-3.5 h-3.5" /></button>
              <button className="p-1 rounded hover:text-white"><List className="w-3.5 h-3.5" /></button>
            </div>
            <Button variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Batch AI Audit
            </Button>
          </div>
        </div>

        {/* Row 3: Main Stream & Right Tickers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 8 Cols: PR Cards Stream */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* PR #142 - High Risk */}
            <div className="bg-[#111622] rounded-xl border border-red-500/30 hover:border-red-500/60 transition p-5 shadow-xl shadow-red-950/10 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-300">#142</span>
                  <Badge variant="critical" pulse={true}>HIGH RISK (SCORE: 84/100)</Badge>
                  <span className="text-xs font-mono text-slate-400 bg-[#161d2c] px-2 py-0.5 rounded border border-[#232d42]">
                    core-api-gateway
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>48 mins ago</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white hover:text-blue-400 cursor-pointer transition">
                  feat(auth): Migrate JWT authentication to OIDC OAuth2 & WebAuthn support
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                  <span>feat/oidc-webauthn → main</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300">Sarah Chen (Staff SecOps)</span>
                </div>
              </div>

              {/* AI Alert Callout */}
              <div className="bg-[#151a27] border border-red-500/25 rounded-lg p-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-red-300 block">AI BLOCKING ALERT</span>
                    <span className="text-slate-300">Token Expiry Inconsistency & Potential Memory Leak in </span>
                    <code className="bg-[#0a0e16] px-1.5 py-0.5 rounded text-red-300 font-mono text-[11px] border border-red-500/30">
                      SessionHandler.ts:84
                    </code>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-400">+542</span>
                  <span className="text-red-400">-128</span>
                  <span className="text-slate-500">8 files</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1c2436] flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Reviewers:</span>
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-[10px] font-bold flex items-center justify-center">AR</div>
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-[10px] font-bold flex items-center justify-center">AI</div>
                  </div>
                  <span className="font-semibold text-red-400 ml-2">1 Blocker Raised</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">Quick Diff</Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={onNavigateToWorkspace}
                    icon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Inspect in Review Workspace
                  </Button>
                </div>
              </div>
            </div>

            {/* PR #145 - Medium Risk */}
            <div className="bg-[#111622] rounded-xl border border-[#1e2538] hover:border-slate-700 transition p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-300">#145</span>
                  <Badge variant="purple">MEDIUM RISK (SCORE: 42/100)</Badge>
                  <span className="text-xs font-mono text-slate-400 bg-[#161d2c] px-2 py-0.5 rounded border border-[#232d42]">payment-processor</span>
                </div>
                <span className="text-slate-400 text-xs">2 hrs ago</span>
              </div>

              <h3 className="text-base font-bold text-white">
                fix(billing): Handle Stripe webhook idempotency and race condition in subscription renewal
              </h3>

              <div className="bg-[#151a27] border border-[#222b3e] rounded-lg p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Review Applied: 2 concurrent lock optimizations inserted into Redis hook.</span>
                </div>
                <span className="text-emerald-400 font-mono">Ready for approval</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1c2436] text-xs">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-emerald-400">+89</span>
                  <span className="text-red-400">-14</span>
                  <span className="text-slate-400">3 files</span>
                  <span className="text-emerald-400 font-sans flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CI Passing
                  </span>
                </div>
                <Button variant="secondary" size="sm">Review Diff</Button>
              </div>
            </div>

            {/* PR #149 - Low Risk */}
            <div className="bg-[#111622] rounded-xl border border-[#1e2538] hover:border-slate-700 transition p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-300">#149</span>
                  <Badge variant="safe">LOW RISK (SCORE: 12/100)</Badge>
                  <span className="text-xs font-mono text-slate-400 bg-[#161d2c] px-2 py-0.5 rounded border border-[#232d42]">core-api-gateway</span>
                </div>
                <span className="text-slate-400 text-xs">3 hrs ago</span>
              </div>

              <h3 className="text-base font-bold text-white">
                perf(db): Optimize Postgres indexes for payment_ledger query pagination
              </h3>

              <div className="bg-[#141b26] border border-emerald-500/20 rounded-lg p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Verified: EXPLAIN ANALYZE shows 4.1x faster scan, 0 breaking changes.</span>
                </div>
                <Badge variant="safe" size="sm">14/14 GREEN</Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1c2436] text-xs">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-emerald-400">+45</span>
                  <span className="text-red-400">-12</span>
                  <span className="text-slate-400">2 files</span>
                </div>
                <Button variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Fast-Track Auto-Merge
                </Button>
              </div>
            </div>

          </div>

          {/* Right 4 Cols: Tickers & Champions */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Security Ticker */}
            <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1c2333] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Security Ticker</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">ACTIVE STREAM</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#151a28] border border-red-500/20 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-red-400 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> CVE-POTENTIAL
                    </span>
                    <span className="font-mono text-slate-400">PR #142</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">Unsanitized redirect parameter in OIDC callback vector.</p>
                  <span className="text-[10px] text-emerald-400 block pt-1">Patch generated by Agent</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#151a28] border border-purple-500/20 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> RACE-HAZARD
                    </span>
                    <span className="font-mono text-slate-400">PR #145</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">Atomic Redis lock missing expiration fallback during stalls.</p>
                  <span className="text-[10px] text-slate-400 block pt-1">Resolved in commit 4f98d</span>
                </div>
              </div>
            </div>

            {/* Merge Radar */}
            <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1c2333] pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" /> Merge Radar
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between py-1 border-b border-[#171d2b]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> #136 api/cors-policy
                  </span>
                  <span className="text-slate-500 text-[10px]">Merged 18m ago</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> #132 schema-v3
                  </span>
                  <span className="text-red-400 text-[10px]">Rolled back</span>
                </div>
              </div>
            </div>

            {/* Speed Champions */}
            <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1c2333] pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Speed Champions
                </h4>
                <span className="text-[10px] text-slate-500 font-mono font-bold">WEEKLY</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold text-[11px]">01</span>
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="w-6 h-6 rounded-full" alt="Alex" />
                    <div>
                      <div className="font-semibold text-slate-200">Alex Rivera</div>
                      <div className="text-[10px] text-slate-500">24 reviews</div>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold text-[11px]">12m avg</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};