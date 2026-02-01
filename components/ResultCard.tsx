
import React from 'react';
import { DetectionResult } from '../types';

interface Props {
  result: DetectionResult;
}

const ResultCard: React.FC<Props> = ({ result }) => {
  const isAI = result.classification === 'AI_GENERATED';
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Detection Result</h3>
          <div className={`text-3xl font-bold ${isAI ? 'text-red-400' : 'text-emerald-400'}`}>
            {isAI ? 'Synthetic (AI)' : 'Natural (Human)'}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400 text-xs font-medium mb-1">Confidence Score</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${isAI ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${result.confidenceScore}%` }}
              />
            </div>
            <span className="font-mono font-bold text-lg">{result.confidenceScore}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Summary Analysis
          </h4>
          <p className="text-slate-300 leading-relaxed text-sm bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
            {result.explanation}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Linguistic Observation</h4>
            <ul className="space-y-2">
              {result.linguisticCues.map((cue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  {cue}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Audio Forensics</h4>
            <ul className="space-y-2">
              {result.audioArtifacts.map((artifact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  {artifact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
