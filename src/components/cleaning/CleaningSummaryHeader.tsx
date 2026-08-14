import React from 'react';
import { ShieldAlert, CheckCircle2, Layers, Database, ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';
import { AnalysisResults } from '../../types';

interface SummaryHeaderProps {
  analysis: AnalysisResults;
  issuesCount: number;
  recommendationsCount: number;
}

export const CleaningSummaryHeader: React.FC<SummaryHeaderProps> = ({
  analysis,
  issuesCount,
  recommendationsCount,
}) => {
  const metrics = analysis.beforeAfterMetrics;
  const currentScore = metrics ? metrics.preparedScore : analysis.overallScore;
  const originalScore = metrics ? metrics.originalScore : analysis.overallScore;
  const scoreDiff = metrics ? metrics.scoreImprovement : 0;

  return (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Data Cleaning &amp; Feature Preparation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Smart Data Preparation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prepare dataset <span className="font-semibold text-slate-700 dark:text-slate-300">'{analysis.datasetName}'</span> based on risks identified by the ML Data-Readiness Analyzer.
          </p>
        </div>

        {metrics && (
          <div className="flex items-center space-x-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 p-3.5 rounded-xl">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Readiness Evolution</span>
              <div className="flex items-center space-x-2 font-black text-lg text-slate-900 dark:text-white">
                <span className="text-slate-400 line-through text-sm">{originalScore}/100</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xl">{currentScore}/100</span>
              </div>
            </div>
            {scoreDiff > 0 && (
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-500 text-white font-extrabold text-xs rounded-lg shadow-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{scoreDiff} PTS</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Issues Detected</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{issuesCount}</p>
          <span className="text-[10px] text-slate-500">From initial audit</span>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Recommended Actions</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">{recommendationsCount}</p>
          <span className="text-[10px] text-slate-500">Auto-configured</span>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
            <Layers className="w-4 h-4 text-sky-500" />
            <span>Total Rows</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {analysis.profile.rowCount.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Working dataset</span>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
            <Database className="w-4 h-4 text-purple-500" />
            <span>Feature Columns</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {analysis.profile.columnCount}
          </p>
          <span className="text-[10px] text-slate-500">Target: {analysis.targetColumn}</span>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Readiness Score</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <p className="text-xl font-black text-slate-900 dark:text-white">{currentScore}</p>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            currentScore >= 80 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            currentScore >= 60 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
            'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {analysis.overallStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
