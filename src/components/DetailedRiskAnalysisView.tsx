import React, { useState } from 'react';
import { AnalysisResults, RiskItem, RiskSeverity } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  Info
} from 'lucide-react';

interface DetailedRiskAnalysisProps {
  analysis: AnalysisResults;
  onNavigate: (tab: string) => void;
}

export const DetailedRiskAnalysisView: React.FC<DetailedRiskAnalysisProps> = ({
  analysis,
  onNavigate
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRisks = analysis.risks.filter(r => {
    const matchesSeverity = selectedSeverity === 'all' || r.severity === selectedSeverity;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.feature && r.feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.evidence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Detailed Risk Analysis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit of detected ML risk signals, data leakage warnings, and structural flaws for dataset <strong className="text-slate-200">{analysis.datasetName}</strong>.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search risks or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'high', 'medium', 'low'].map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded font-semibold capitalize transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Items List */}
      {filteredRisks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No risks matching selected filter</h3>
          <p className="text-xs text-slate-400 mt-1">Your dataset is clean according to the active criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              className={`bg-slate-900 border rounded-2xl p-6 space-y-4 shadow-xl transition-all ${
                risk.severity === 'high'
                  ? 'border-rose-500/30 bg-gradient-to-r from-rose-950/10 via-slate-900 to-slate-900'
                  : 'border-amber-500/30'
              }`}
            >
              {/* Risk Title & Severity Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                    risk.severity === 'high'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {risk.severity} RISK
                  </span>
                  <h3 className="text-base font-bold text-white">{risk.title}</h3>
                </div>

                {risk.feature && (
                  <span className="text-xs text-indigo-300 font-mono bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800/60 self-start sm:self-auto">
                    Feature: {risk.feature}
                  </span>
                )}
              </div>

              {/* The 3 UX Questions Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. What was detected? */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-rose-400 text-[11px] uppercase tracking-wider block">
                    1. Evidence Detected
                  </span>
                  <p className="text-slate-300 font-medium leading-relaxed">{risk.evidence}</p>
                </div>

                {/* 2. Why does it matter? */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">
                    2. Why It Matters
                  </span>
                  <p className="text-slate-300 leading-relaxed">{risk.whyItMatters}</p>
                </div>

                {/* 3. Recommended Action */}
                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/60 space-y-1.5">
                  <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">
                    3. Recommended Action
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">{risk.recommendedAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
