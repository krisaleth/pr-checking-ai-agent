import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  Lock, 
  Database, 
  Layers, 
  Check, 
  Play, 
  RotateCcw, 
  Save, 
  Info, 
  Activity, 
  FileCode, 
  Plus
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/shared/Badge';
import { Button } from '../components/shared/Button';

export const RulePolicyConfig: React.FC = () => {
  const [reviewTone, setReviewTone] = useState<'strict' | 'balanced' | 'educational'>('strict');
  const [minQualityScore, setMinQualityScore] = useState<number>(75);
  const [gateSecurity, setGateSecurity] = useState<boolean>(true);
  const [gateAiSummary, setGateAiSummary] = useState<boolean>(true);
  const [gateAutoTests, setGateAutoTests] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'prompt' | 'gates' | 'scanners' | 'webhooks'>('prompt');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0a0e16] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. Header Dùng Chung */}
      <Header />

      {/* 2. Main Content Container */}
      <div className="p-6 space-y-5 max-w-7xl w-full mx-auto pb-24">
        
        {/* Breadcrumb & Title Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
            <span>POLICIES</span>
            <span>&gt;</span>
            <span>REPOSITORY GOVERNANCE</span>
            <span>&gt;</span>
            <span className="text-emerald-400">PAYMENT-GATEWAY-SERVICE</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                AI Review Rules & Quality Gate Policies
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Configure automated AI prompts, security thresholds, and coding standards enforced for repository: <span className="text-slate-300 font-mono font-medium">payment-gateway-service</span>.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Badge variant="safe" pulse={true}>Sync: Protected Branch (main)</Badge>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 font-mono font-bold text-[11px] uppercase tracking-wider">
                ACTIVE POLICY
              </span>
            </div>
          </div>
        </div>

        {/* Policy Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1c2438] pb-1 overflow-x-auto text-xs">
          {[
            { id: 'prompt', label: 'Prompt Engineering & Custom Instructions', icon: Sparkles },
            { id: 'gates', label: 'Quality Gates & Blockers', icon: ShieldCheck },
            { id: 'scanners', label: 'Vulnerability Scanners', icon: Activity, count: 4 },
            { id: 'webhooks', label: 'Integration & Webhooks', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition border-b-2 -mb-[5px] whitespace-nowrap ${
                  isActive 
                    ? 'border-blue-500 bg-[#141926] text-blue-400 font-semibold' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 8 Cols: Main Config */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AI Persona Box */}
            <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Persona & Review Tone Configuration</h3>
                    <p className="text-xs text-slate-400">Fine-tune system prompts and automated reasoning depth.</p>
                  </div>
                </div>
                <Badge variant="purple">MODEL: CLAUDE-3.7-SONAR-CODE</Badge>
              </div>

              {/* Code Preview */}
              <div className="rounded-xl border border-[#212a3d] bg-[#0c1018] overflow-hidden shadow-2xl">
                <div className="bg-[#141926] px-4 py-2 border-b border-[#212a3d] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-blue-400" /> system-instructions.agent.md
                    </span>
                  </div>
                  <div className="text-emerald-400 text-[11px] flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3" /> Token Cost: ~482 tkn
                  </div>
                </div>

                <div className="p-4 font-mono text-xs space-y-1.5 bg-[#090d15] text-slate-300">
                  <div className="text-slate-600"><span className="text-blue-400">1</span>  <span className="text-purple-400">role:</span> system</div>
                  <div className="text-slate-600"><span className="text-blue-400">2</span>  <span className="text-purple-400">instruction:</span> &gt;</div>
                  <div className="text-slate-300 pl-4 border-l border-[#1c2438]">
                    <span className="text-slate-600 pr-2">3</span> 
                    You are a <strong className="text-emerald-400">Staff Security Engineer</strong> reviewing Golang and TypeScript microservices. Focus strictly on <span className="text-amber-300 font-semibold">OWASP Top 10</span>, concurrency deadlocks, and idempotency in payment flows.
                  </div>
                </div>
              </div>

              {/* Tone Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">AI Review Attitude & Tone</span>
                  <Badge variant="safe">
                    {reviewTone === 'strict' && 'Strict / Gatekeeper'}
                    {reviewTone === 'balanced' && 'Balanced / Pragmatic'}
                    {reviewTone === 'educational' && 'Educational / Mentoring'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['strict', 'balanced', 'educational'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setReviewTone(tone)}
                      className={`p-3 rounded-lg border text-left transition ${
                        reviewTone === tone
                          ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-sm'
                          : 'bg-[#141926] border-[#222a3d] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold capitalize">{tone} Mode</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality Gates Box */}
            <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Automated Merge Blocking Rules (Quality Gates)</h3>
                    <p className="text-xs text-slate-400">Deterministic checks evaluated before PRs merge.</p>
                  </div>
                </div>
                <Badge variant="safe">3 GATES ENFORCING</Badge>
              </div>

              {/* Toggle 1 */}
              <div className="p-4 rounded-xl bg-[#141926] border border-[#222a3d] flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-200">Block PR merge if AI detects High/Critical Security Vulnerabilities</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="critical" size="sm">HARD BLOCKER</Badge>
                    <span className="text-[10px] font-mono text-slate-500">Rule #SEC-2025-01</span>
                  </div>
                </div>
                <button
                  onClick={() => setGateSecurity(!gateSecurity)}
                  className={`w-11 h-6 rounded-full p-1 transition flex items-center shrink-0 ${
                    gateSecurity ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                </button>
              </div>

              {/* Quality Score Slider */}
              <div className="p-4 rounded-xl bg-[#141926] border border-[#222a3d] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Minimum AI Code Quality Score to pass</span>
                  <span className="text-2xl font-black font-mono text-white">{minQualityScore} <span className="text-xs text-slate-500">/100</span></span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  value={minQualityScore}
                  onChange={(e) => setMinQualityScore(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

          </div>

          {/* Right 4 Cols: Enforcement Ring & Preset Library */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-5 space-y-4 text-center">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-left">Enforcement Engine</h4>
              <div className="py-2">
                <span className="text-4xl font-black font-mono text-emerald-400">88%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mt-1">Rule Parity</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#1a2133] text-left">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">EVALUATED</span>
                  <span className="text-base font-bold font-mono text-white">1,492 PRs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">BUGS CAUGHT</span>
                  <span className="text-base font-bold font-mono text-emerald-400">143</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111622] border border-[#1e2538] rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rule Preset Library</h4>
              <div className="p-3 rounded-lg bg-[#141926] border border-[#222a3d] space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>OWASP Security Suite 2025</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">Active on 14 repos • v3.4.1</div>
              </div>
              <Button variant="secondary" size="sm" className="w-full" icon={<Plus className="w-3.5 h-3.5" />}>
                Create Custom Rule
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <footer className="fixed bottom-0 left-64 right-0 bg-[#0d121c]/95 backdrop-blur border-t border-[#1c2333] px-6 py-3 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Repository policy has <strong className="text-white font-mono">2 staged edits</strong> waiting for activation.</span>
          {isSaved && <span className="text-emerald-400 font-bold ml-2 animate-bounce">✓ Policies Activated!</span>}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Revert to Org Defaults
          </Button>
          <Button variant="secondary" size="sm" icon={<Play className="w-3 h-3 text-blue-400" />}>
            Test Prompt on Latest 5 PRs
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />}>
            Save Changes
          </Button>
        </div>
      </footer>

    </div>
  );
};