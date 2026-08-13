import React from 'react';
import { HelpCircle, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Brain, Sparkles, Layers } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (tab: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full">
          Educational Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Why "Clean Data" Does Not Equal "Good ML Data"
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          Traditional data cleaning fixes null values and formatting syntax. ML Data-Readiness auditing prevents model failure, data leakage, and silent prediction breakdown in production.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Standard Data Cleaning</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-mono">•</span>
              <span>Checks if missing cells are filled or imputed.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-mono">•</span>
              <span>Validates column data type syntax (e.g., date formats).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-mono">•</span>
              <span>Deduplicates duplicate rows.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-mono">•</span>
              <span className="text-rose-300 font-semibold">Ignores whether features are available at inference time.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-500 font-mono">•</span>
              <span className="text-rose-300 font-semibold">Ignores target class imbalance and ID column memorization.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-6 space-y-4 bg-gradient-to-b from-indigo-950/20 to-slate-900">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>ML Data-Readiness Risk Analysis</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Detects potential Data Leakage (features recorded post-outcome).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Audits Target Imbalance and warns against deceptive accuracy metrics.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Identifies Identifier Columns (UUIDs/IDs) that cause model memorization.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Flags High-Cardinality categorical variables before encoding.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Generates an actionable 0-100 ML Readiness Score with AI guidance.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* The 3 Core Questions UX Philosophy */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Core UX Philosophy: The 3 Critical Questions</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Question 1</span>
            <h3 className="font-bold text-white text-sm">What is wrong?</h3>
            <p className="text-xs text-slate-400">e.g. "Possible data leakage detected in feature account_closed_date."</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Question 2</span>
            <h3 className="font-bold text-white text-sm">Why does it matter?</h3>
            <p className="text-xs text-slate-400">e.g. "Feature is filled after customer churn occurs and is unavailable at prediction time."</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Question 3</span>
            <h3 className="font-bold text-white text-sm">What should I do?</h3>
            <p className="text-xs text-slate-400">e.g. "Investigate feature availability and drop account_closed_date before model training."</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('upload')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center space-x-2"
        >
          <span>Audit Your Dataset Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
