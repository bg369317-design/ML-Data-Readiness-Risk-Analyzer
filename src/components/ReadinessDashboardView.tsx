import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine
} from 'recharts';
import { AnalysisResults } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  BarChart3,
  Layers,
  Target,
  Sparkles,
  Info,
  ShieldCheck,
  Activity,
  PieChart,
  Wand2,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { ScoreBreakdownModal } from './ScoreBreakdownModal';

interface ReadinessDashboardProps {
  analysis: AnalysisResults;
  onNavigate: (tab: string) => void;
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
        <p className="font-bold text-white">{data.subject}</p>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-400">Score:</span>
          <span className="font-extrabold text-indigo-400 font-mono">{data.score}/100</span>
        </div>
        <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">{data.desc}</p>
      </div>
    );
  }
  return null;
};

export const ReadinessDashboardView: React.FC<ReadinessDashboardProps> = ({
  analysis,
  onNavigate
}) => {
  const [isScoreBreakdownOpen, setIsScoreBreakdownOpen] = useState(false);
  const { overallScore, overallStatus, scores, profile, risks, leakageFindings } = analysis;

  const subScoreItems = [
    { label: "Data Completeness", score: scores.completeness, desc: "Absence of missing cells & duplicates" },
    { label: "Data Consistency", score: scores.consistency, desc: "Type alignment & constant column health" },
    { label: "Target Quality", score: scores.targetQuality, desc: "Class balance & distribution health" },
    { label: "Feature Quality", score: scores.featureQuality, desc: "Cardinality & identifier risk isolation" },
    { label: "Leakage Risk", score: scores.leakageRisk, desc: "Freedom from temporal post-event signals" },
    { label: "ML Safety", score: scores.mlSafety, desc: "Overall model safety index" }
  ];

  const radarData = [
    { subject: 'Completeness', score: scores.completeness, fullMark: 100, desc: "Absence of missing cells & duplicates" },
    { subject: 'Consistency', score: scores.consistency, fullMark: 100, desc: "Type alignment & constant column health" },
    { subject: 'Target Quality', score: scores.targetQuality, fullMark: 100, desc: "Class balance & distribution health" },
    { subject: 'Feature Quality', score: scores.featureQuality, fullMark: 100, desc: "Cardinality & identifier risk isolation" },
    { subject: 'Leakage Risk', score: scores.leakageRisk, fullMark: 100, desc: "Freedom from temporal post-event signals" },
    { subject: 'ML Safety', score: scores.mlSafety, fullMark: 100, desc: "Overall model safety index" }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-900 dark:text-slate-100">
      {/* Top Banner & Main Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Readiness Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="lg:col-span-1 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            ML Readiness Score
          </span>

          {/* Big Score Badge */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "backOut" }}
            onClick={() => setIsScoreBreakdownOpen(true)}
            className="relative my-2 cursor-pointer group"
            title="Click to view full score breakdown math"
          >
            <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center bg-slate-900 shadow-inner transition-transform group-hover:scale-105 ${
              overallStatus === 'Ready'
                ? 'border-emerald-500 text-emerald-400 shadow-emerald-500/10 group-hover:border-emerald-400'
                : overallStatus === 'Needs Review'
                ? 'border-amber-500 text-amber-400 shadow-amber-500/10 group-hover:border-amber-400'
                : 'border-rose-500 text-rose-400 shadow-rose-500/10 group-hover:border-rose-400'
            }`}>
              <span className="text-4xl font-extrabold tracking-tight">{overallScore}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase mt-0.5">/ 100</span>
              <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold mt-1">
                Click to Explain
              </span>
            </div>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-2"
          >
            {overallStatus === 'Ready' && (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> 🟢 READY FOR ML
              </span>
            )}
            {overallStatus === 'Needs Review' && (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 mr-1.5" /> 🟡 NEEDS REVIEW
              </span>
            )}
            {overallStatus === 'High Risk' && (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-4 h-4 mr-1.5" /> 🔴 HIGH RISK
              </span>
            )}
          </motion.div>

          {/* Clickable Score Breakdown Action Button */}
          <button
            onClick={() => setIsScoreBreakdownOpen(true)}
            className="mt-4 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-950 text-indigo-400 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 group"
          >
            <Calculator className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Score Breakdown</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              Why {overallScore}?
            </span>
          </button>

          {/* Disclaimer text */}
          <p className="text-[11px] text-slate-400 mt-3 leading-normal italic px-2">
            “The ML Readiness Score is an analytical risk indicator generated by this application. Click above to view the exact mathematical formula.”
          </p>
        </motion.div>

        {/* Dataset Quick Summary & Subscores Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-2 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700/80 pb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>{analysis.datasetName}</span>
                <span className="text-xs font-normal text-slate-400">({analysis.predictionType})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Target: <strong className="text-indigo-300">{analysis.targetColumn}</strong> | Objective: {analysis.predictionObjective || 'Standard task'}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onNavigate('smart-prep')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow transition-all flex items-center space-x-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Prepare &amp; Clean Dataset</span>
              </button>
              <button
                onClick={() => onNavigate('report')}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-xs shadow transition-all"
              >
                Export Full Report
              </button>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-700/80 text-xs">
            <div>
              <span className="text-slate-500">Rows</span>
              <p className="font-bold text-white text-sm">{profile.rowCount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-slate-500">Columns</span>
              <p className="font-bold text-white text-sm">{profile.columnCount}</p>
            </div>
            <div>
              <span className="text-slate-500">Missing Cells</span>
              <p className={`font-bold text-sm ${profile.totalMissingPercentage > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {profile.totalMissingPercentage}%
              </p>
            </div>
            <div>
              <span className="text-slate-500">Leakage Features</span>
              <p className={`font-bold text-sm ${leakageFindings.length > 0 ? 'text-rose-400 font-extrabold' : 'text-emerald-400'}`}>
                {leakageFindings.length}
              </p>
            </div>
          </div>

          {/* Subscores breakdown with staggered entry animations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Readiness Framework Subscores
              </h3>
              <button
                onClick={() => setIsScoreBreakdownOpen(true)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <span>View Full Score Math</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subScoreItems.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 + idx * 0.07, ease: "easeOut" }}
                  whileHover={{ scale: 1.015, borderColor: 'rgba(99, 102, 241, 0.4)' }}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 transition-colors cursor-default"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">{item.label}</span>
                    <span className="font-bold font-mono text-indigo-400">{item.score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.7, delay: 0.3 + idx * 0.07, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        item.score >= 80 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                        item.score >= 60 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                        'bg-gradient-to-r from-rose-600 to-rose-400'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphical Representation: Readiness Spider Radar & Subscore Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Radar Spider Chart Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">ML Readiness Radar Profile</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
              6 Dimensions Spider
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tick={{ fill: '#cbd5e1' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Tooltip content={<CustomRadarTooltip />} />
                <Radar
                  name="Readiness Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#818cf8"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-6 text-[11px] text-slate-400 pt-2 border-t border-slate-700/80">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              <span>Current Score Polygon</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
              <span>Max Capacity (100)</span>
            </div>
          </div>
        </div>

        {/* Subscore Benchmark Bar Chart Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Dimension Scores vs Benchmark</h3>
            </div>
            <div className="flex items-center space-x-2 text-[11px]">
              <span className="text-slate-400">Target Line:</span>
              <span className="text-amber-400 font-bold font-mono">70/100</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarData} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="subject" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} width={90} />
                <Tooltip content={<CustomRadarTooltip />} />
                <ReferenceLine x={70} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Target (70)', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
                  {radarData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.score >= 80 ? '#10b981' :
                        entry.score >= 60 ? '#f59e0b' : '#f43f5e'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/80">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded bg-emerald-500 inline-block"/> <span className="text-emerald-400 font-semibold">Ready (&ge;80)</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded bg-amber-500 inline-block"/> <span className="text-amber-400 font-semibold">Review (60-79)</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded bg-rose-500 inline-block"/> <span className="text-rose-400 font-semibold">High Risk (&lt;60)</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Critical Risks Alert Banner */}
      {risks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-white">Top Detected Risk Signals ({risks.length})</h3>
            </div>

            <button
              onClick={() => onNavigate('risks')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View All Detailed Risks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {risks.slice(0, 3).map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + idx * 0.08 }}
                className="bg-slate-900 p-4 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      r.severity === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {r.severity}
                    </span>
                    <h4 className="text-xs font-bold text-white">{r.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{r.evidence}</p>
                </div>

                <button
                  onClick={() => onNavigate('risks')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xs font-medium border border-slate-700 shrink-0"
                >
                  Inspect Evidence
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Score Breakdown Modal */}
      <ScoreBreakdownModal
        isOpen={isScoreBreakdownOpen}
        onClose={() => setIsScoreBreakdownOpen(false)}
        analysis={analysis}
        onNavigate={onNavigate}
      />
    </div>
  );
};
