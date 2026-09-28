import React from 'react';

interface RiskScoreRadarProps {
  score: number;
  breakingProtocol: 'Low' | 'Medium' | 'High';
  testCoverage: number;
}

export const RiskScoreRadar: React.FC<RiskScoreRadarProps> = ({
  score,
  breakingProtocol,
  testCoverage
}) => {
  const getBorderColor = () => {
    if (score >= 75) return 'border-red-500';
    if (score >= 40) return 'border-amber-500';
    return 'border-emerald-500';
  };

  const getTextColor = () => {
    if (score >= 75) return 'text-red-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="bg-[#141926] p-4 rounded-xl border border-[#222a3d] space-y-2">
      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
        Risk Matrix
      </span>
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 rounded-full border-4 ${getBorderColor()} flex items-center justify-center font-bold font-mono text-base ${getTextColor()}`}>
          {score}
        </div>
        <div className="text-right space-y-0.5 text-xs">
          <div className={`${getTextColor()} font-bold`}>Composite: {score}/100</div>
          <div className="text-slate-400 text-[10px]">Breaking Protocol: {breakingProtocol}</div>
          <div className="text-emerald-400 text-[10px]">Test Coverage: {testCoverage}%</div>
        </div>
      </div>
    </div>
  );
};