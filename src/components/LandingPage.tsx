import React from 'react';
import {
  Brain,
  ArrowRight,
  ShieldAlert,
  Database,
  Target,
  BarChart2,
  FileCheck2,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  User,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { UserProfile } from '../types';

interface LandingPageProps {
  user: UserProfile | null;
  onNavigate: (tab: string, accountType?: 'user' | 'admin') => void;
  onTryDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ user, onNavigate, onTryDemo }) => {
  const workflowSteps = [
    { title: "Dataset", desc: "CSV or XLSX upload" },
    { title: "Data Profiling", desc: "Schema & statistical types" },
    { title: "ML Risk Detection", desc: "Leakage & imbalance checks" },
    { title: "Readiness Scoring", desc: "0-100 ML Risk Framework" },
    { title: "AI Explanation", desc: "Gemini plain-language assessment" },
    { title: "Recommendations", desc: "Prioritized pre-training actions" }
  ];

  const featureCards = [
    {
      icon: Database,
      title: "Dataset Profiling",
      desc: "Instant schema type inference, missingness ratios, cell density, and memory usage profiling across numeric, categorical, and text columns."
    },
    {
      icon: CheckCircle2,
      title: "Data Quality Analysis",
      desc: "Identifies duplicate rows, inconsistent data types, constant/zero-variance features, and missingness severity."
    },
    {
      icon: ShieldAlert,
      title: "Data Leakage Detection",
      desc: "Identifies temporal post-outcome features and target-derived columns that artificially inflate validation metrics but fail in production."
    },
    {
      icon: Target,
      title: "Target Analysis",
      desc: "Audits class distributions, minority-class representation, imbalance ratios for classification, and skewness for regression tasks."
    },
    {
      icon: Layers,
      title: "Feature Risk Detection",
      desc: "Flags identifier columns (UUIDs/IDs) causing memorization, high-cardinality categorical variables, and suspicious feature distributions."
    },
    {
      icon: BarChart2,
      title: "Outlier Detection",
      desc: "Uses statistical IQR and Z-score methods to flag extreme values without blindly recommending deletion of genuine extreme events."
    },
    {
      icon: FileCheck2,
      title: "ML Readiness Score",
      desc: "Calculates an objective 0-100 ML Readiness Score across Completeness, Consistency, Target Quality, Feature Safety, and Leakage Risk."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Recommendations",
      desc: "Generates clear, prioritized next steps explaining What was detected, Why it matters, and What action to take before training."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Authentication Callout Banner if logged out */}
      {!user && (
        <div className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 py-2.5 px-4 text-center text-xs text-slate-700 dark:text-slate-300">
          <span className="inline-flex items-center space-x-1 font-semibold text-amber-700 dark:text-amber-300 mr-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Authentication Required:</span>
          </span>
          Please log in as a <strong className="text-indigo-700 dark:text-indigo-300">User</strong> or <strong className="text-amber-700 dark:text-amber-300">Admin</strong> to use the ML Readiness Risk Analyzer features.
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-10 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Pre-Training Dataset Audit Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 max-w-4xl mx-auto leading-tight sm:leading-snug">
          Know whether your dataset is ready for machine learning{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
            before you train your model.
          </span>
        </h1>

        <blockquote className="text-base sm:text-lg text-indigo-900 dark:text-indigo-200/90 max-w-2xl mx-auto mb-4 italic font-medium">
          “Clean data does not automatically mean good ML data.”
        </blockquote>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
          Upload your dataset, define your ML objective, and let the system identify data-quality problems, leakage risks, target issues, suspicious features, outliers, and other ML-readiness concerns.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
          {!user ? (
            <>
              {/* Separate User Login CTA */}
              <button
                onClick={() => onNavigate('login', 'user')}
                className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 group"
              >
                <User className="w-4 h-4" />
                <span>User Login &amp; Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Separate Admin Login CTA */}
              <button
                onClick={() => onNavigate('login', 'admin')}
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login</span>
              </button>

              {/* Try Demo CTA */}
              <button
                onClick={onTryDemo}
                className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Try Demo Dataset</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('upload')}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-base shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Analyze Dataset</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-base transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Go to Dashboard</span>
              </button>

              {user.isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-base shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* Visual Workflow Diagram */}
      <section className="py-8 sm:py-10 bg-slate-100/80 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-5">
            The Complete ML Readiness Workflow
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col items-center justify-center text-center relative group hover:border-indigo-500/40 shadow-sm transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold flex items-center justify-center mb-1.5">
                  {idx + 1}
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
                {idx < workflowSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-600 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Built Specifically for ML-Specific Risks
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm">
            Standard data profilers show you missing values. ML Readiness Risk Analyzer detects data leakage, memorization hazards, target imbalance, and ML pipeline failure risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 rounded-xl p-5 transition-all group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{card.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
