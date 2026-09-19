import React, { useState } from 'react';
import { Sparkles, GitBranch, FileCode, ShieldAlert, AlertTriangle } from 'lucide-react';
import { CodeDiffViewer } from '../components/workspace/CodeDiffViewer';
import { RiskScoreRadar } from '../components/workspace/RiskScoreRadar';
import { Badge } from '../components/shared/Badge';
import { Button } from '../components/shared/Button';

export const PRReviewWorkspace: React.FC = () => {
  const [patchApplied, setPatchApplied] = useState(false);

  const sampleFinding = {
    id: 'PATCH-SEC-0142',
    cwe: 'CWE-384 HIGH',
    title: 'Missing State Nonce & PKCE Code Verifier',
    description: 'Missing State Nonce & PKCE Code Verifier validation. Unvalidated state parameter exposes OAuth2 flow to Login CSRF / Session Fixation.',
    removedCode: '- token, err := client.Exchange(ctx, code)',
    addedCode: [
      '+ if err := session.ValidateState(r.URL.Query().Get("state")); err != nil { return nil, ErrInvalidState }',
      '+ token, err := client.Exchange(ctx, code, oauth2.SetAuthURLParam("code_verifier", session.Verifier))'
    ]
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0e16]">
      {/* Workspace Header */}
      <div className="h-14 border-b border-[#1e2536] px-6 flex items-center justify-between bg-[#0e131d]">
        <div className="flex items-center gap-3">
          <Badge variant="info">PR #142</Badge>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            feat(auth): Migrate JWT authentication to OIDC OAuth2 & WebAuthn
            <Badge variant="critical">HIGH RISK</Badge>
          </h2>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-slate-500" /> feat/oidc-webauthn → main
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400">+542</span>
          <span className="text-xs font-mono text-red-400">-128</span>
          <Button 
            variant="primary" 
            onClick={() => setPatchApplied(true)}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {patchApplied ? 'Patch Applied ✓' : 'Auto-Apply 2 Safe Patches'}
          </Button>
          <Button variant="primary">Submit Review</Button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left File Tree */}
        <div className="w-64 border-r border-[#1e2536] bg-[#0c1018] p-3 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Files Changed</span>
              <span className="text-slate-500 font-mono text-[10px]">5/5</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="p-2 rounded bg-blue-600/10 border border-blue-500/30 text-blue-300 flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">oidc_handler.go</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-[#131824] rounded-lg border border-[#222a3d] space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Security Findings</span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-400 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> 1 Blocker</span>
              <span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> 2 Warnings</span>
            </div>
          </div>
        </div>

        {/* Center: Diff Viewer */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <CodeDiffViewer 
            fileName="src/auth/oidc_handler.go"
            language="Go 1.22"
            finding={sampleFinding}
            patchApplied={patchApplied}
            onApplyPatch={() => setPatchApplied(true)}
          />
        </div>

        {/* Right: Risk Radar */}
        <div className="w-80 border-l border-[#1e2536] bg-[#0c1018] p-4 space-y-4">
          <RiskScoreRadar score={88} breakingProtocol="High" testCoverage={92} />
        </div>
      </div>
    </div>
  );
};