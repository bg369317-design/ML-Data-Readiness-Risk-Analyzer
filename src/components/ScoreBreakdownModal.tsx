import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calculator,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingDown,
  ArrowRight,
  Wand2,
  PieChart,
  Sliders,
  Sparkles,
  Layers,
  Target,
  Database,
  Activity,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { AnalysisResults, RiskItem } from '../types';

interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResults;
  onNavigate: (tab: string) => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { overallScore, overallStatus, scores, profile, targetAnalysis, leakageFindings, risks } = analysis;

  // Exact math parameters for dimensions
  const dimensions = [
    {
      id: 'completeness',
      name: 'Data Completeness',
      weight: 20,
      score: scores.completeness,
      points: Number((scores.completeness * 0.20).toFixed(1)),
      maxPoints: 20.0,
      icon: Database,
      formula: '100 - (Missing Cell % × 2) - (Duplicate Row % × 3)',
      deductions: [
        {
          label: 'Missing Cells Penalty',
          value: `-${(profile.totalMissingPercentage * 2).toFixed(1)} pts`,
          details: `${profile.totalMissingPercentage}% total missing cells across dataset`
        },
        {
          label: 'Duplicate Rows Penalty',
          value: `-${(profile.duplicateRowPercentage * 3).toFixed(1)} pts`,
          details: `${profile.duplicateRowCount} duplicate rows (${profile.duplicateRowPercentage}%)`
        }
      ]
    },
    {
      id: 'consistency',
      name: 'Data Consistency',
      weight: 15,
      score: scores.consistency,
      points: Number((scores.consistency * 0.15).toFixed(1)),
      maxPoints: 15.0,
      icon: Layers,
      formula: '100 - (Constant Zero-Variance Columns × 15)',
      deductions: [
        {
          label: 'Constant Columns Penalty',
          value: `-${profile.columns.filter(c => c.isConstant).length * 15} pts`,
          details: `${profile.columns.filter(c => c.isConstant).length} zero-variance column(s) detected`
        }
      ]
    },
    {
      id: 'targetQuality',
      name: 'Target Quality',
      weight: 20,
      score: scores.targetQuality,
      points: Number((scores.targetQuality * 0.20).toFixed(1)),
      maxPoints: 20.0,
      icon: Target,
      formula: targetAnalysis.isImbalanced
        ? '100 - (Class Imbalance Ratio × 8) [min 20]'
        : '95 pts (Base score for healthy target)',
      deductions: targetAnalysis.isImbalanced
        ? [
            {
              label: 'Target Class Imbalance Penalty',
              value: `-${((targetAnalysis.imbalanceRatio || 1) * 8).toFixed(1)} pts`,
              details: `Imbalance ratio ${targetAnalysis.imbalanceRatio}x (${targetAnalysis.majorityClass}: ${targetAnalysis.majorityPercentage}%)`
            }
          ]
        : []
    },
    {
      id: 'featureQuality',
      name: 'Feature Quality',
      weight: 20,
      score: scores.featureQuality,
      points: Number((scores.featureQuality * 0.20).toFixed(1)),
      maxPoints: 20.0,
      icon: Sliders,
      formula: '100 - (High Cardinality × 12) - (Identifier Columns × 25)',
      deductions: [
        {
          label: 'High Cardinality Penalty',
          value: `-${profile.columns.filter(c => c.isHighCardinality).length * 12} pts`,
          details: `${profile.columns.filter(c => c.isHighCardinality).length} high cardinality categorical feature(s)`
        },
        {
          label: 'Identifier Columns Penalty',
          value: `-${profile.columns.filter(c => c.isIdentifier && c.name !== analysis.targetColumn).length * 25} pts`,
          details: `${profile.columns.filter(c => c.isIdentifier && c.name !== analysis.targetColumn).length} unique ID/Key column(s) detected`
        }
      ]
    },
    {
      id: 'leakageRisk',
      name: 'Data Leakage Safety',
      weight: 15,
      score: scores.leakageRisk,
      points: Number((scores.leakageRisk * 0.15).toFixed(1)),
      maxPoints: 15.0,
      icon: ShieldAlert,
      formula: '100 - (Detected Leakage Features × 35)',
      deductions: [
        {
          label: 'Target Leakage Penalty',
          value: `-${leakageFindings.length * 35} pts`,
          details: `${leakageFindings.length} feature(s) show suspicious post-event correlation or target leakage`
        }
      ]
    },
    {
      id: 'mlSafety',
      name: 'ML Safety Index',
      weight: 10,
      score: scores.mlSafety,
      points: Number((scores.mlSafety * 0.10).toFixed(1)),
      maxPoints: 10.0,
      icon: Activity,
      formula: '100 - (High Severity Risks × 18)',
      deductions: [
        {
          label: 'Critical Risk Multiplier Penalty',
          value: `-${risks.filter(r => r.severity === 'high').length * 18} pts`,
          details: `${risks.filter(r => r.severity === 'high').length} high-severity risk factor(s) impacting generalizability`
        }
      ]
    }
  ];

  // Total points calculated
  const totalCalculatedPoints = dimensions.reduce((acc, d) => acc + d.points, 0).toFixed(1);

  // Filter risks based on category tab
  const filteredRisks = risks.filter(r => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'high') return r.severity === 'high';
    if (selectedCategory === 'leakage') return r.category === 'leakage';
    if (selectedCategory === 'target') return r.category === 'target';
    if (selectedCategory === 'quality') return r.category === 'quality' || r.category === 'cardinality' || r.category === 'identifier' || r.category === 'constant';
    return true;
  });

  // Positive readiness signals
  const positiveSignals = [];
  if (leakageFindings.length === 0) {
    positiveSignals.push({
      title: 'Zero Data Leakage Detected',
      desc: 'No features exhibit post-event leakage or suspicious 100% correlation with the target label.'
    });
  }
  if (profile.duplicateRowCount === 0) {
    positiveSignals.push({
      title: 'Zero Duplicate Rows',
      desc: 'Dataset is clean of identical row duplications (+3.0 pts full bonus in completeness).'
    });
  }
  if (!targetAnalysis.isImbalanced) {
    positiveSignals.push({
      title: 'Balanced Target Distribution',
      desc: 'Target classes are well-balanced without extreme majority dominance.'
    });
  }
  if (profile.columns.filter(c => c.isIdentifier && c.name !== analysis.targetColumn).length === 0) {
    positiveSignals.push({
      title: 'No Identifier Overhead',
      desc: 'No high-cardinality primary keys or IDs detected in feature set.'
    });
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Dark Backdrop with Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-20 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
                  <span>ML Readiness Score Breakdown</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                    Math Model
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Exact risk metric deductions and weighted formula for <strong className="text-slate-200">{analysis.datasetName}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            {/* Top Score Summary Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
              <div className="flex items-center space-x-5">
                {/* Gauge Circle */}
                <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center bg-slate-950 shrink-0 font-mono ${
                  overallStatus === 'Ready'
                    ? 'border-emerald-500 text-emerald-400 shadow-emerald-500/20 shadow-lg'
                    : overallStatus === 'Needs Review'
                    ? 'border-amber-500 text-amber-400 shadow-amber-500/20 shadow-lg'
                    : 'border-rose-500 text-rose-400 shadow-rose-500/20 shadow-lg'
                }`}>
                  <span className="text-3xl font-black">{overallScore}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">/ 100</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    {overallStatus === 'Ready' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready For Machine Learning</span>
                      </span>
                    )}
                    {overallStatus === 'Needs Review' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Needs Pre-Processing Review</span>
                      </span>
                    )}
                    {overallStatus === 'High Risk' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>High Risk - Do Not Train Yet</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300">
                    Status Criteria:{' '}
                    <span className="text-slate-400">
                      {overallStatus === 'High Risk'
                        ? 'Score is < 65 OR 1+ severe data leakage risk detected.'
                        : overallStatus === 'Needs Review'
                        ? 'Score is < 85 OR > 2 risk signals detected.'
                        : 'Score is ≥ 85 with 0 leakage findings.'}
                    </span>
                  </p>

                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono pt-1">
                    <span>Base Score: <strong className="text-white">100 pts</strong></span>
                    <span>•</span>
                    <span>Total Risk Penalties: <strong className="text-rose-400">-{(100 - overallScore).toFixed(1)} pts</strong></span>
                    <span>•</span>
                    <span>Weighted Sum: <strong className="text-indigo-400">{totalCalculatedPoints} pts</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('smart-prep');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Fix &amp; Boost Score</span>
                </button>
              </div>
            </div>

            {/* Section 1: Weighted Subscore Derivation Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-indigo-400" />
                  <span>1. Weighted Dimension Subscores</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Overall Score = ∑ (Dimension Subscore × Weight)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dimensions.map((dim) => {
                  const DimIcon = dim.icon;
                  const isExpanded = expandedDimension === dim.id;

                  return (
                    <div
                      key={dim.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-indigo-400">
                              <DimIcon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-white">{dim.name}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-slate-900 text-indigo-300 rounded font-mono text-[10px] font-bold border border-slate-800">
                            Weight: {dim.weight}%
                          </span>
                        </div>

                        {/* Subscore Bar & Points */}
                        <div className="flex items-baseline justify-between pt-1">
                          <div className="flex items-baseline space-x-1">
                            <span className="text-xl font-extrabold font-mono text-white">{dim.score}</span>
                            <span className="text-xs text-slate-500">/100</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold font-mono text-emerald-400">+{dim.points}</span>
                            <span className="text-[10px] text-slate-500"> / {dim.maxPoints} max pts</span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              dim.score >= 80 ? 'bg-emerald-500' : dim.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>

                        <p className="text-[10px] text-slate-400 font-mono bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                          Formula: {dim.formula}
                        </p>
                      </div>

                      {/* Deductions accordion toggle */}
                      {dim.deductions.length > 0 && dim.deductions.some(d => !d.value.startsWith('-0')) && (
                        <div className="pt-2 border-t border-slate-900">
                          <button
                            onClick={() => setExpandedDimension(isExpanded ? null : dim.id)}
                            className="w-full flex items-center justify-between text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                          >
                            <span className="flex items-center space-x-1">
                              <TrendingDown className="w-3 h-3" />
                              <span>View Deductions ({dim.deductions.length})</span>
                            </span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 space-y-1.5 text-[11px] bg-slate-900/90 p-2 rounded border border-slate-800">
                              {dim.deductions.map((ded, idx) => (
                                <div key={idx} className="flex justify-between items-start space-x-2">
                                  <span className="text-slate-300">{ded.label}:</span>
                                  <span className="font-mono font-bold text-rose-400 shrink-0">{ded.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Specific Risk Deductions & Impact Analysis */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>2. Risk Factors Impacting Score ({risks.length})</span>
                </h3>

                {/* Filter tabs */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedCategory === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({risks.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('high')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedCategory === 'high' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    High ({risks.filter(r => r.severity === 'high').length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('leakage')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      selectedCategory === 'leakage' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Leakage ({risks.filter(r => r.category === 'leakage').length})
                  </button>
                </div>
              </div>

              {filteredRisks.length === 0 ? (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">No risks found matching this filter!</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {filteredRisks.map((risk) => (
                    <div
                      key={risk.id}
                      className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              risk.severity === 'high'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {risk.severity} SEVERITY
                            </span>
                            <span className="text-xs font-bold text-white">{risk.title}</span>
                          </div>
                          <p className="text-xs text-slate-400">{risk.evidence}</p>
                        </div>

                        <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-lg text-xs font-mono font-bold border border-rose-500/20 shrink-0">
                          {risk.severity === 'high' ? '-18 to -35 pts' : '-8 to -15 pts'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800/80 flex items-start space-x-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong className="text-slate-300">Why it deducted score:</strong> {risk.whyItMatters}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Positive Readiness Signals */}
            {positiveSignals.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>3. Positive Quality Indicators ({positiveSignals.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {positiveSignals.map((sig, idx) => (
                    <div
                      key={idx}
                      className="bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-xl space-y-1 flex items-start space-x-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-300">{sig.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{sig.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Use Smart Preparation to automatically resolve risks and re-calculate score.</span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  onClose();
                  onNavigate('risks');
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs border border-slate-700 transition-all"
              >
                Detailed Risk View
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('smart-prep');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-1.5"
              >
                <Wand2 className="w-4 h-4" />
                <span>Open Smart Data Prep</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
