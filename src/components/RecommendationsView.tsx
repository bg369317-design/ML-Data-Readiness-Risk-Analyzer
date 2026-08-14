import React from 'react';
import { AnalysisResults, RecommendationItem } from '../types';
import { ListOrdered, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, Wand2 } from 'lucide-react';

interface RecommendationsProps {
  analysis: AnalysisResults;
  onNavigate: (tab: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsProps> = ({
  analysis,
  onNavigate
}) => {
  const { recommendations } = analysis;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <ListOrdered className="w-6 h-6 text-indigo-400" />
            <span>Actionable Recommendations Engine</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritized step-by-step remediation plan to resolve data leakage and dataset risks before model training.
          </p>
        </div>

        <button
          onClick={() => onNavigate('smart-prep')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all shrink-0"
        >
          <Wand2 className="w-4 h-4" />
          <span>Apply Smart Data Prep</span>
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-slate-900 border rounded-2xl p-6 space-y-4 shadow-xl ${
              item.priority === 1
                ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900'
                : item.priority === 2
                ? 'border-amber-500/30'
                : 'border-slate-800'
            }`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  item.priority === 1
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : item.priority === 2
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  Priority {item.priority} — {item.priorityLabel}
                </span>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
              </div>

              {item.feature && (
                <span className="text-xs text-indigo-300 font-mono bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800">
                  {item.feature}
                </span>
              )}
            </div>

            {/* The 3 Core UX Questions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-1">
                <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] block">
                  What Was Detected?
                </span>
                <p className="text-slate-300 font-medium leading-relaxed">{item.whatWasDetected}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                  Why Does It Matter?
                </span>
                <p className="text-slate-300 leading-relaxed">{item.whyItMatters}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/60 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                  What Should You Do?
                </span>
                <p className="text-slate-100 font-semibold leading-relaxed">{item.recommendedAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
