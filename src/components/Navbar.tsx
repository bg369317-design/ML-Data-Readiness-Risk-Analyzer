import React from 'react';
import {
  Brain,
  PlusCircle,
  User,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  LogOut,
  Sliders,
  Lock,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { AnalysisResults, UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  currentAnalysis: AnalysisResults | null;
  activeTab: string;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onNavigate: (tab: string, accountType?: 'user' | 'admin') => void;
  onLogout: () => void;
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentAnalysis,
  activeTab,
  theme = 'dark',
  onToggleTheme,
  onNavigate,
  onLogout,
  isMobileSidebarOpen,
  onToggleMobileSidebar
}) => {
  return (
    <header className="h-16 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white shadow-sm transition-colors duration-200 z-30 relative">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile Toggle & Brand Logo */}
        <div className="flex items-center space-x-3">
          {/* Mobile Sidebar Hamburger Button */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              title="Toggle Menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5 text-indigo-500" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-none">
                  ML Readiness Risk Analyzer
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-500/30 rounded-full">
                  AI Powered
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden md:block">Pre-Training Dataset Auditor</p>
            </div>
          </div>
        </div>

        {/* Active Analysis Quick Score pill */}
        {currentAnalysis && user && (
          <div className="hidden lg:flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-600 dark:text-slate-400">Active: <strong className="text-slate-900 dark:text-slate-200">{currentAnalysis.datasetName}</strong></span>
            
            <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-300 dark:border-slate-700">
              {currentAnalysis.overallStatus === 'Ready' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Ready ({currentAnalysis.overallScore}/100)
                </span>
              )}
              {currentAnalysis.overallStatus === 'Needs Review' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                  Review ({currentAnalysis.overallScore}/100)
                </span>
              )}
              {currentAnalysis.overallStatus === 'High Risk' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  High Risk ({currentAnalysis.overallScore}/100)
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigate('readiness')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium underline underline-offset-2 ml-1"
            >
              View Score
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Light / Dark Mode Toggle Option */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5 text-xs font-semibold shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline text-amber-300">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden md:inline text-indigo-700 font-bold">Dark Mode</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            {user ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-4 h-4 text-indigo-200" />}
            <span>Analyze Dataset</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              {user.isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center space-x-1.5 transition-all ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="User Profile"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs border ${
                  user.isAdmin ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                }`}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-200 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {user.isAdmin ? 'System Admin' : 'ML User'}
                  </div>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Separate User Login Button */}
              <button
                onClick={() => onNavigate('login', 'user')}
                className="px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg transition-all flex items-center space-x-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>User Login</span>
              </button>

              {/* Separate Admin Login Button */}
              <button
                onClick={() => onNavigate('login', 'admin')}
                className="px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/30 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold rounded-lg transition-all flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="hidden sm:inline-block px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
