import React from 'react';
import { AnalysisResults } from '../types';
import { Target, AlertTriangle, CheckCircle2, BarChart2, Info } from 'lucide-react';

interface TargetAnalysisProps {
  analysis: AnalysisResults;
  onNavigate: (tab: string) => void;
}

export const TargetAnalysisView: React.FC<TargetAnalysisProps> = ({
  analysis,
  onNavigate
}) => {
  const { targetAnalysis, predictionType } = analysis;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Target className="w-6 h-6 text-indigo-400" />
          <span>Target Column Analysis: <span className="text-indigo-300">{targetAnalysis.targetColumn}</span></span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ML objective task: <strong className="text-slate-200 capitalize">{predictionType}</strong> | Goal: {targetAnalysis.objective}
        </p>
      </div>

      {/* Classification Target Analysis */}
      {predictionType === 'classification' && targetAnalysis.classPercentages && (
        <div className="space-y-6">
          {/* Imbalance Alert Banner */}
          {targetAnalysis.isImbalanced ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>⚠ High Class Imbalance Detected ({targetAnalysis.majorityPercentage}% vs {targetAnalysis.minorityPercentage}%)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The majority class <strong className="text-white">'{targetAnalysis.majorityClass}'</strong> dominates the target distribution (Imbalance Ratio: {targetAnalysis.imbalanceRatio}x).
                Evaluating your model with standard Accuracy will produce deceptive results—a dummy model predicting only '{targetAnalysis.majorityClass}' will achieve {targetAnalysis.majorityPercentage}% accuracy while providing 0% recall on minority events.
              </p>
              <div className="text-xs text-amber-300 font-semibold bg-amber-950/60 p-3 rounded-lg border border-amber-800/60">
                Recommended Mitigation: Use Precision-Recall AUC (PR-AUC), F1-Score, SMOTE resampling, or class-weighted loss functions during model optimization.
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex items-center space-x-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Target class distribution is well-balanced across all {targetAnalysis.numClasses} classes.</span>
            </div>
          )}

          {/* Class Distribution Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Target Class Distribution
            </h3>

            <div className="space-y-4">
              {Object.entries(targetAnalysis.classPercentages).map(([cls, pct]) => {
                const count = targetAnalysis.classDistribution?.[cls] || 0;
                const isMajority = cls === targetAnalysis.majorityClass;
                return (
                  <div key={cls} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white flex items-center space-x-2">
                        <span>Class '{cls}'</span>
                        {isMajority && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500/20 text-indigo-300 rounded font-bold border border-indigo-500/30">
                            MAJORITY
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-slate-300">{count.toLocaleString()} samples ({pct}%)</span>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all ${isMajority ? 'bg-indigo-500' : 'bg-cyan-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Regression Target Analysis */}
      {predictionType === 'regression' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Regression Target Distribution Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500">Minimum</span>
              <p className="font-bold text-white text-base">{targetAnalysis.min}</p>
            </div>
            <div>
              <span className="text-slate-500">Mean</span>
              <p className="font-bold text-white text-base">{targetAnalysis.mean}</p>
            </div>
            <div>
              <span className="text-slate-500">Median</span>
              <p className="font-bold text-white text-base">{targetAnalysis.median}</p>
            </div>
            <div>
              <span className="text-slate-500">Maximum</span>
              <p className="font-bold text-white text-base">{targetAnalysis.max}</p>
            </div>
          </div>

          {targetAnalysis.isSkewed && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Target Distribution Skewness Warning</p>
                <p className="text-slate-300 mt-0.5">
                  Target variable exhibits significant right skewness (Skew: {targetAnalysis.skewness}). Consider applying a log1p transformation before linear regression training.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
