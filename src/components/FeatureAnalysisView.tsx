import React, { useState } from 'react';
import { AnalysisResults, ColumnProfile } from '../types';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Database,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info
} from 'lucide-react';

interface FeatureAnalysisProps {
  analysis: AnalysisResults;
  onNavigate: (tab: string) => void;
}

export const FeatureAnalysisView: React.FC<FeatureAnalysisProps> = ({
  analysis,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColumn, setSelectedColumn] = useState<ColumnProfile | null>(null);

  const pageSize = 10;
  const columns = analysis.profile.columns;

  const getColumnRiskLevel = (col: ColumnProfile): 'High' | 'Medium' | 'Low' => {
    const isLeakage = analysis.leakageFindings.some(l => l.featureName === col.name);
    if (isLeakage || col.isIdentifier || col.missingPercentage > 30) return 'High';
    if (col.isHighCardinality || col.missingPercentage > 10 || col.isConstant) return 'Medium';
    return 'Low';
  };

  const filteredColumns = columns.filter(col => {
    const risk = getColumnRiskLevel(col);
    const matchesRisk = selectedRisk === 'all' || risk.toLowerCase() === selectedRisk;
    const matchesSearch = col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const totalPages = Math.ceil(filteredColumns.length / pageSize) || 1;
  const paginatedColumns = filteredColumns.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Database className="w-6 h-6 text-indigo-400" />
            <span>Feature Risk Analysis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detailed column-level assessment of missingness, cardinality, data types, and leakage risks.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'high', 'medium', 'low'].map(risk => (
              <button
                key={risk}
                onClick={() => { setSelectedRisk(risk); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded font-semibold capitalize transition-colors ${
                  selectedRisk === risk
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Inferred Type</th>
                <th className="py-3 px-4">Missing %</th>
                <th className="py-3 px-4">Unique Values</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedColumns.map((col) => {
                const risk = getColumnRiskLevel(col);
                const isTarget = col.name === analysis.targetColumn;
                return (
                  <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center space-x-2">
                        <span>{col.name}</span>
                        {isTarget && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded font-semibold">
                            TARGET
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-300">
                      <span className="px-2 py-0.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px]">
                        {col.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <span className={col.missingPercentage > 15 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {col.missingPercentage}% ({col.missingCount})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {col.uniqueCount.toLocaleString()} ({col.uniquePercentage}%)
                    </td>
                    <td className="py-3 px-4">
                      {risk === 'High' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          🔴 HIGH
                        </span>
                      )}
                      {risk === 'Medium' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          🟡 MEDIUM
                        </span>
                      )}
                      {risk === 'Low' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          🟢 LOW
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {col.isIdentifier ? (
                        <span className="text-[11px] text-rose-400 font-semibold">Identifier Risk</span>
                      ) : col.isHighCardinality ? (
                        <span className="text-[11px] text-amber-400 font-semibold">High Cardinality</span>
                      ) : col.isConstant ? (
                        <span className="text-[11px] text-amber-400 font-semibold">Constant Value</span>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">Usable</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedColumn(col)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-xs font-semibold border border-slate-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {paginatedColumns.length} of {filteredColumns.length} features</span>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-white">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Inspect Modal / Drawer */}
      {selectedColumn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedColumn(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Feature Inspection
              </span>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2 mt-0.5">
                <span>{selectedColumn.name}</span>
                <span className="text-xs font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {selectedColumn.type}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500">Missing Count</span>
                <p className="font-bold text-white text-sm">{selectedColumn.missingCount} ({selectedColumn.missingPercentage}%)</p>
              </div>
              <div>
                <span className="text-slate-500">Unique Values</span>
                <p className="font-bold text-white text-sm">{selectedColumn.uniqueCount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-500">Identifier Status</span>
                <p className={`font-bold text-sm ${selectedColumn.isIdentifier ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedColumn.isIdentifier ? 'Yes (High Risk)' : 'No'}
                </p>
              </div>
              {selectedColumn.min !== undefined && (
                <>
                  <div>
                    <span className="text-slate-500">Min</span>
                    <p className="font-bold text-white">{selectedColumn.min}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Mean</span>
                    <p className="font-bold text-white">{selectedColumn.mean}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Max</span>
                    <p className="font-bold text-white">{selectedColumn.max}</p>
                  </div>
                </>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Sample Values</h4>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {selectedColumn.sampleValues.map((val, idx) => (
                  <span key={idx} className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-slate-300">
                    {String(val)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedColumn(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
