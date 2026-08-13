import React, { useState } from 'react';
import { AnalysisResults } from '../types';
import { Sparkles, Brain, RefreshCw, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

interface AIAssessmentProps {
  analysis: AnalysisResults;
  onRefreshAI: () => Promise<void>;
}

export const AIAssessmentView: React.FC<AIAssessmentProps> = ({
  analysis,
  onRefreshAI
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const aiSummary = analysis.aiSummary;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshAI();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold rounded-full inline-flex items-center space-x-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gemini AI Senior Data Auditor</span>
          </span>
          <h1 className="text-2xl font-extrabold text-white">
            AI Executive Dataset Assessment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plain-language LLM synthesis of statistical findings and ML risks for dataset <strong className="text-slate-200">{analysis.datasetName}</strong>.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md transition-all shrink-0 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh AI Assessment</span>
        </button>
      </div>

      {aiSummary ? (
        <div className="space-y-6">
          {/* Executive Verdict Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Executive Plain-Language Summary</span>
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {aiSummary.plainLanguageSummary}
            </p>
          </div>

          {/* Major Risks & Why They Matter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Detected ML Risks Explanation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiSummary.majorRisksExplanation}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Why These Risks Matter for Production
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiSummary.whyEachMatters}
              </p>
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Recommended Actionable Next Steps
            </h3>
            <div className="space-y-2.5">
              {aiSummary.recommendedNextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Verdict Callout */}
          <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-xs text-indigo-200 space-y-2">
            <h4 className="font-bold text-white text-sm">Final Readiness Verdict</h4>
            <p className="leading-relaxed">{aiSummary.finalReadinessExplanation}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800">
          <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
          <p className="text-xs text-slate-400">Generating AI Executive Assessment...</p>
        </div>
      )}
    </div>
  );
};
