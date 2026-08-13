import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Brain, Sparkles, ShieldAlert } from 'lucide-react';

interface AnalysisProgressProps {
  fileName: string;
  onComplete: () => void;
}

export const AnalysisProgressView: React.FC<AnalysisProgressProps> = ({
  fileName,
  onComplete
}) => {
  const steps = [
    "File validation",
    "Schema analysis",
    "Data profiling",
    "Missing-value analysis",
    "Duplicate analysis",
    "Target analysis",
    "Feature analysis",
    "Outlier detection",
    "Leakage risk analysis",
    "ML readiness scoring",
    "Generating AI recommendations"
  ];

  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedSteps(prev => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round((completedSteps / steps.length) * 100));

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">Analyzing {fileName}</h2>
          <p className="text-xs text-slate-400">
            Running statistical profiling, data leakage heuristics, target imbalance checks, and Gemini AI assessment...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-indigo-400">Audit Progress</span>
            <span className="text-white">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-600 to-cyan-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps Checklist */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 max-h-64 overflow-y-auto">
          {steps.map((step, idx) => {
            const isDone = idx < completedSteps;
            const isCurrent = idx === completedSteps;
            return (
              <div
                key={step}
                className={`flex items-center space-x-3 text-xs font-medium transition-all ${
                  isDone
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-indigo-300 font-bold'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
