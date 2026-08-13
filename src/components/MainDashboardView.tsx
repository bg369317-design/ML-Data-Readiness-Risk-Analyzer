import React from 'react';
import {
  PlusCircle,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Database,
  FileCheck2,
  Trash2,
  Zap,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { AnalysisResults } from '../types';

interface MainDashboardProps {
  history: any[];
  onNavigate: (tab: string) => void;
  onSelectAnalysis: (id: string) => void;
  onDeleteAnalysis: (id: string) => void;
  onTryDemo: () => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 text-slate-900 dark:text-slate-100">
        <p className="font-bold text-slate-900 dark:text-white">{data.fullName}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-500 dark:text-slate-400">Readiness Score:</span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{data.score}/100</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-500 dark:text-slate-400">Status:</span>
          <span className={`font-semibold ${
            data.status === 'Ready' ? 'text-emerald-600 dark:text-emerald-400' :
            data.status === 'Needs Review' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
          }`}>{data.status}</span>
        </div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5 border-t border-slate-100 dark:border-slate-800">{data.date}</div>
      </div>
    );
  }
  return null;
};

export const MainDashboardView: React.FC<MainDashboardProps> = ({
  history,
  onNavigate,
  onSelectAnalysis,
  onDeleteAnalysis,
  onTryDemo
}) => {
  const totalAnalyzed = history.length;
  const highRiskCount = history.filter(h => h.overallStatus === 'High Risk').length;
  const avgScore = totalAnalyzed > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / totalAnalyzed)
    : 0;
  const totalRisks = history.reduce((acc, curr) => acc + (curr.riskCount || 0), 0);

  // Chronologically sort history & extract last 5 analyzed datasets for trend chart
  const sortedChronological = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const lastFive = sortedChronological.slice(-5);

  const chartData = lastFive.map((item) => ({
    name: item.datasetName.length > 12 ? `${item.datasetName.slice(0, 10)}…` : item.datasetName,
    fullName: item.datasetName,
    score: item.overallScore,
    status: item.overallStatus,
    date: new Date(item.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-white dark:from-indigo-900/40 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md dark:shadow-xl transition-colors duration-200">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            ML Audit Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Welcome back!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
            Analyze your dataset before training your next ML model to detect data leakage, target imbalance, and feature risks.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onTryDemo}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Try Demo Dataset</span>
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Analyze New Dataset</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Datasets Analyzed</span>
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalAnalyzed}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Audited pre-training sets</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">High-Risk Datasets</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">{highRiskCount}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Data leakage or severe issues</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Readiness</span>
            <BarChart3 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-300 mt-2">{avgScore}%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Mean ML readiness score</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Critical Issues</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{totalRisks}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Total detected risk items</p>
        </div>
      </div>

      {/* ML Readiness Score Trend Chart */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-sm transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">ML Readiness Score Trend</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Readiness score trajectory across your last {lastFive.length > 0 ? lastFive.length : 5} analyzed datasets
            </p>
          </div>
          {lastFive.length > 0 && (
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400">Latest Score:</span>
              <span className="text-sm font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                {lastFive[lastFive.length - 1].overallScore}/100
              </span>
            </div>
          )}
        </div>

        {lastFive.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
            No audit history recorded yet. Run a dataset analysis to track score trends over time.
          </div>
        ) : (
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 12, right: 24, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Ready (70+)', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, fill: '#6366f1', stroke: '#4f46e5', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Analyses Table */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Dataset Analyses</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review past risk scores and re-open complete reports</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center space-x-1"
          >
            <span>View All History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <Database className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No datasets analyzed yet.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Upload a CSV/XLSX file or run the demo dataset.</p>
            <button
              onClick={() => onNavigate('upload')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
            >
              Upload First Dataset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Dataset</th>
                  <th className="py-3 px-4">ML Task</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>{item.datasetName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize font-medium text-slate-600 dark:text-slate-300">
                      {item.predictionType} ({item.targetColumn})
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.overallScore}/100
                    </td>
                    <td className="py-3 px-4">
                      {item.overallStatus === 'Ready' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                        </span>
                      )}
                      {item.overallStatus === 'Needs Review' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Needs Review
                        </span>
                      )}
                      {item.overallStatus === 'High Risk' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                          <ShieldAlert className="w-3 h-3 mr-1" /> High Risk
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectAnalysis(item.id)}
                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/40 text-indigo-700 dark:text-indigo-300 rounded font-semibold text-xs border border-indigo-200 dark:border-indigo-500/30 transition-colors"
                      >
                        View Report
                      </button>
                      <button
                        onClick={() => onDeleteAnalysis(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
