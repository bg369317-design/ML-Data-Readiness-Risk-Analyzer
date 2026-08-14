import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  ShieldAlert,
  BarChart2,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { AnalysisResults } from '../../types';

interface BeforeAfterProps {
  analysis: AnalysisResults;
}

export const BeforeAfterComparison: React.FC<BeforeAfterProps> = ({ analysis }) => {
  const metrics = analysis.beforeAfterMetrics;
  if (!metrics) {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-500">
        Apply cleaning transformations to generate Before vs After comparison metrics.
      </div>
    );
  }

  const resolvedRisks = analysis.risks.filter((r) => metrics.resolvedRiskIds.includes(r.id));
  const remainingRisks = analysis.risks.filter((r) => metrics.remainingRiskIds.includes(r.id));

  return (
    <div className="space-y-6">
      {/* Before / After Header Banner */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Dataset Re-Analysis Complete</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              ML Readiness Before &amp; After Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Comparison between raw input dataset and prepared ML feature matrix.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Before</span>
              <span className="text-lg font-black text-slate-600 dark:text-slate-300">{metrics.originalScore} / 100</span>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-500" />
            <div className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">After</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{metrics.preparedScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Stats Table Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Rows</span>
            <div className="flex items-baseline justify-between text-sm font-bold">
              <span className="text-slate-500 line-through">{metrics.originalRows.toLocaleString()}</span>
              <span className="text-slate-900 dark:text-white font-extrabold">{metrics.preparedRows.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">{metrics.rowsRemoved} rows cleaned</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-slate-500">Missing Values</span>
            <div className="flex items-baseline justify-between text-sm font-bold">
              <span className="text-slate-500 line-through">{metrics.originalMissingPercentage}%</span>
              <span className="text-slate-900 dark:text-white font-extrabold">{metrics.preparedMissingPercentage}%</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">Statistical Imputation</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-slate-500">Duplicate Rows</span>
            <div className="flex items-baseline justify-between text-sm font-bold">
              <span className="text-slate-500 line-through">{metrics.originalDuplicates}</span>
              <span className="text-slate-900 dark:text-white font-extrabold">{metrics.preparedDuplicates}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">100% Unique Rows</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-slate-500">Readiness Boost</span>
            <div className="flex items-baseline justify-between text-sm font-bold">
              <span className="text-slate-500">{metrics.originalScore}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">+{metrics.scoreImprovement} PTS</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">Status: {metrics.preparedStatus}</span>
          </div>
        </div>
      </div>

      {/* Resolved vs Remaining Risks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolved Risks */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Resolved ML Risks ({resolvedRisks.length})
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Resolved
            </span>
          </div>

          {resolvedRisks.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {resolvedRisks.map((risk) => (
                <div key={risk.id} className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-900 dark:text-emerald-200">{risk.title}</span>
                    {risk.feature && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        {risk.feature}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{risk.recommendedAction}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No risks resolved yet in this iteration.</p>
          )}
        </div>

        {/* Remaining Risks */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Remaining ML Risks ({remainingRisks.length})
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Requires Review
            </span>
          </div>

          {remainingRisks.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {remainingRisks.map((risk) => (
                <div key={risk.id} className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-900 dark:text-amber-200">{risk.title}</span>
                    {risk.feature && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                        {risk.feature}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{risk.whyItMatters}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">All detected ML risks have been successfully resolved!</p>
          )}
        </div>
      </div>
    </div>
  );
};
