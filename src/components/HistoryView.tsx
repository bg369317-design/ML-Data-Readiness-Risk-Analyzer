import React from 'react';
import { History, Eye, Trash2, CheckCircle2, AlertTriangle, ShieldAlert, PlusCircle } from 'lucide-react';

interface HistoryProps {
  history: any[];
  onSelectAnalysis: (id: string) => void;
  onDeleteAnalysis: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const HistoryView: React.FC<HistoryProps> = ({
  history,
  onSelectAnalysis,
  onDeleteAnalysis,
  onNavigate
}) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-indigo-400" />
            <span>Analysis History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access past dataset risk audits and re-open comprehensive readiness reports.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Analyze New Dataset</span>
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No analysis history recorded</h3>
          <p className="text-xs text-slate-400 mt-1">Upload a dataset to start auditing.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Dataset Name</th>
                  <th className="py-3.5 px-4">ML Task</th>
                  <th className="py-3.5 px-4">Target Column</th>
                  <th className="py-3.5 px-4">Rows × Cols</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{item.datasetName}</td>
                    <td className="py-3.5 px-4 capitalize text-slate-300">{item.predictionType}</td>
                    <td className="py-3.5 px-4 font-mono text-indigo-300">{item.targetColumn || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{item.rowCount} × {item.columnCount}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{item.overallScore}/100</td>
                    <td className="py-3.5 px-4">
                      {item.overallStatus === 'Ready' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                        </span>
                      )}
                      {item.overallStatus === 'Needs Review' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Review
                        </span>
                      )}
                      {item.overallStatus === 'High Risk' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ShieldAlert className="w-3 h-3 mr-1" /> High Risk
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectAnalysis(item.id)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-xs shadow"
                      >
                        Re-open
                      </button>
                      <button
                        onClick={() => onDeleteAnalysis(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
