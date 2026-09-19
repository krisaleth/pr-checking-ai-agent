import React from 'react';
import { ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';

export interface Finding {
  id: string;
  cwe: string;
  title: string;
  description: string;
  removedCode: string;
  addedCode: string[];
}

interface InlineAICalloutProps {
  finding: Finding;
  isApplied: boolean;
  onApplyPatch: () => void;
  onExplain?: () => void;
}

export const InlineAICallout: React.FC<InlineAICalloutProps> = ({
  finding,
  isApplied,
  onApplyPatch,
  onExplain
}) => {
  return (
    <div className="my-3 mx-2 p-4 rounded-xl bg-[#141824] border border-red-500/40 shadow-xl space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
          <ShieldAlert className="w-4 h-4" />
          <span>ReviewPulse AI Security Guard</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 font-mono text-red-300 border border-red-500/30">
            {finding.cwe}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">Observed across IdP flows</span>
      </div>

      <p className="text-slate-300 text-xs leading-relaxed">
        <strong className="text-amber-300">Vulnerability Analysis:</strong> {finding.description}
      </p>

      {/* Proposed Patch Preview */}
      <div className="bg-[#0a0e16] rounded-lg p-3 border border-[#222a3d] space-y-1 font-mono text-xs">
        <div className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-1 mb-1">
          <CheckCircle2 className="w-3 h-3" /> PROPOSED PATCH (ID: {finding.id})
        </div>
        <div className="text-red-400 text-[11px] bg-red-950/20 px-1 py-0.5 rounded">
          {finding.removedCode}
        </div>
        {finding.addedCode.map((line, idx) => (
          <div key={idx} className="text-emerald-400 text-[11px] bg-emerald-950/20 px-1 py-0.5 rounded">
            {line}
          </div>
        ))}
      </div>

      {/* Callout Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-2">
          <button 
            onClick={onApplyPatch}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              isApplied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isApplied ? 'Patch Committed ✓' : 'One-Click Apply Fix (Create Commit)'}
          </button>
          {onExplain && (
            <button 
              onClick={onExplain}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Explain Logic
            </button>
          )}
        </div>
        <span className="text-[11px] text-slate-500 hover:underline cursor-pointer">
          Mark as False Positive
        </span>
      </div>
    </div>
  );
};