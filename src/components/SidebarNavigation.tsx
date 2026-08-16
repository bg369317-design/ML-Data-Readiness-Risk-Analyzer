import React from 'react';
import {
  LayoutDashboard,
  Upload,
  ShieldAlert,
  Database,
  Target,
  Sparkles,
  ListOrdered,
  FileCheck2,
  History,
  Settings,
  User,
  HelpCircle,
  Home,
  FileSpreadsheet,
  Lock,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Wand2
} from 'lucide-react';
import { AnalysisResults, UserProfile } from '../types';

interface SidebarProps {
  user: UserProfile | null;
  activeTab: string;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onNavigate: (tab: string, accountType?: 'user' | 'admin') => void;
  currentAnalysis: AnalysisResults | null;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarNavigation: React.FC<SidebarProps> = ({
  user,
  activeTab,
  theme = 'dark',
  onToggleTheme,
  onNavigate,
  currentAnalysis,
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const isLoggedIn = user !== null;

  const handleNavClick = (tab: string, accountType?: 'user' | 'admin') => {
    onNavigate(tab, accountType);
    if (onCloseMobile) onCloseMobile();
  };

  const publicNav = [
    { id: 'landing', label: 'Landing Page', icon: Home, public: true },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle, public: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, public: false },
    { id: 'upload', label: 'Dataset Upload', icon: Upload, public: false },
    { id: 'history', label: 'Analysis History', icon: History, public: false },
  ];

  const analysisNav = currentAnalysis && isLoggedIn ? [
    { id: 'readiness', label: 'ML Readiness Score', icon: FileCheck2 },
    { id: 'risks', label: 'Detailed Risk Analysis', icon: ShieldAlert, badge: currentAnalysis.risks.length },
    { id: 'features', label: 'Feature Analysis', icon: Database, badge: currentAnalysis.profile.columnCount },
    { id: 'target', label: 'Target Analysis', icon: Target },
    { id: 'recommendations', label: 'Recommendations', icon: ListOrdered, badge: currentAnalysis.recommendations.length },
    { id: 'smart-prep', label: 'Smart Data Preparation', icon: Wand2 },
    { id: 'ai-assessment', label: 'AI Executive Summary', icon: Sparkles },
    { id: 'report', label: 'Full Readiness Report', icon: FileSpreadsheet },
  ] : [];

  const accountNav = [
    { id: 'settings', label: 'Settings', icon: Settings, public: false },
    { id: 'profile', label: 'User Profile', icon: User, public: false },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/80 flex flex-col h-full shrink-0 text-slate-700 dark:text-slate-300 select-none transition-transform duration-300 z-40
          ${
            isMobileOpen
              ? 'fixed inset-y-0 left-0 top-16 shadow-2xl translate-x-0'
              : 'fixed inset-y-0 left-0 top-16 -translate-x-full lg:translate-x-0 lg:static lg:top-0'
          }`}
      >
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">

        {/* Authentication Status Header Banner */}
        {!isLoggedIn ? (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-300 text-xs font-bold">
              <Lock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Login Required</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              ML Analyzer features require authentication.
            </p>
            <div className="pt-1 flex space-x-1.5">
              <button
                onClick={() => handleNavClick('login', 'user')}
                className="flex-1 py-1.5 bg-indigo-50 dark:bg-indigo-600/30 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/40 rounded text-[11px] font-bold text-center transition-all"
              >
                User Login
              </button>
              <button
                onClick={() => handleNavClick('login', 'admin')}
                className="flex-1 py-1.5 bg-amber-50 dark:bg-amber-500/30 hover:bg-amber-500 text-amber-700 dark:text-amber-200 hover:text-slate-950 border border-amber-200 dark:border-amber-500/40 rounded text-[11px] font-bold text-center transition-all"
              >
                Admin Login
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-3 rounded-xl border space-y-1 ${
            user.isAdmin ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                user.isAdmin ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white'
              }`}>
                {user.isAdmin ? 'Admin Account' : 'User Account'}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.role}</p>
          </div>
        )}

        {/* Core Workspace Nav */}
        <div>
          <h3 className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Main Application
          </h3>
          <nav className="space-y-0.5">
            {publicNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const requiresAuth = !item.public && !isLoggedIn;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {requiresAuth && (
                    <span className="flex items-center space-x-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Lock</span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Section (Only for Admin users) */}
        {isLoggedIn && user.isAdmin && (
          <div>
            <h3 className="px-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Controls</span>
            </h3>
            <nav className="space-y-0.5">
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Control Panel</span>
                </div>
              </button>
            </nav>
          </div>
        )}

        {/* Active Analysis Module Nav */}
        {currentAnalysis && isLoggedIn && (
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active ML Assessment
              </h3>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[90px]" title={currentAnalysis.datasetName}>
                {currentAnalysis.datasetName}
              </span>
            </div>
            
            <nav className="space-y-0.5">
              {analysisNav.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold ${
                        isActive ? 'bg-indigo-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Account & System Preferences */}
        <div>
          <h3 className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Preferences &amp; Account
          </h3>
          <nav className="space-y-0.5">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 mb-1"
              >
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {theme}
                </span>
              </button>
            )}

            {accountNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const requiresAuth = !isLoggedIn;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </div>
                  {requiresAuth && (
                    <span className="flex items-center space-x-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Lock</span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer info box anchored nicely at sidebar bottom */}
      <div className="shrink-0 p-3 border-t border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
        <p className="font-bold text-slate-700 dark:text-slate-300">ML Risk Analyzer v2.4</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">Deterministic Profiling + Gemini LLM</p>
      </div>
    </aside>
  </>
  );
};
