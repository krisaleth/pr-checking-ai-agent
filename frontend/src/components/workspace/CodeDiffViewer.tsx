import React from 'react';
import { InlineAICallout, type Finding } from './InlineAICallout';

interface DiffViewerProps {
  fileName: string;
  language: string;
  finding: Finding;
  patchApplied: boolean;
  onApplyPatch: () => void;
}

export const CodeDiffViewer: React.FC<DiffViewerProps> = ({
  fileName,
  language,
  finding,
  patchApplied,
  onApplyPatch
}) => {
  return (
    <div className="bg-[#0e131d] border border-[#202738] rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      <div className="bg-[#141926] px-4 py-2 border-b border-[#202738] flex items-center justify-between text-slate-400">
        <span className="text-slate-200 font-medium">{fileName}</span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Unified View</span>
          <span className="text-slate-500 text-[10px]">{language}</span>
        </div>
      </div>

      <div className="p-3 space-y-0.5 bg-[#0a0e16]">
        <div className="text-slate-600">84  84  // HandleCallback orchestrates incoming token exchange</div>
        <div className="text-slate-600">85  85  func (h *OIDCCallbackHandler) Handle(w http.ResponseWriter, r *http.Request) &#123;</div>
        
        {/* Dòng code bị xóa */}
        <div className="bg-red-950/30 text-red-300 px-2 py-0.5 border-l-2 border-red-500">
          89      - token, err := client.Exchange(ctx, code)
        </div>

        {/* Hộp thoại AI inline */}
        <InlineAICallout 
          finding={finding}
          isApplied={patchApplied}
          onApplyPatch={onApplyPatch}
        />

        <div className="text-slate-600">90  115   if err != nil &#123;</div>
        <div className="text-slate-600">91  116     h.logger.Error("OAuth token exchange failed", "err", err)</div>
      </div>
    </div>
  );
};