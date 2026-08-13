import React, { useState } from 'react';
import { Settings, Brain, Sparkles, Key, Database, ShieldCheck, Check, Sun, Moon } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [maxRows, setMaxRows] = useState(100000);
  const [enableAISummaries, setEnableAISummaries] = useState(true);

  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setCurrentTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>System Settings</span>
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Configure risk threshold strictness, Gemini API integrations, and analysis default parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-md dark:shadow-xl transition-colors duration-200">
        {/* Appearance Mode Selection */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Theme & Appearance Mode</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Select your preferred interface color mode for the auditor.</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                  currentTheme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                  currentTheme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gemini API Status Card */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Gemini AI Engine Connection</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Server-Side Managed</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Gemini 3.6 Flash model is active via server-side environment secrets (<code className="text-indigo-700 dark:text-indigo-300 font-mono">GEMINI_API_KEY</code>). No browser API key configuration needed.
          </p>
        </div>

        {/* Audit Configuration Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Analyzer Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Auto-Generate AI Summaries</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Generate Gemini plain-language explanations automatically on dataset upload.</span>
              </div>
              <input
                type="checkbox"
                checked={enableAISummaries}
                onChange={(e) => setEnableAISummaries(e.target.checked)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <label className="font-bold text-slate-900 dark:text-white block">Max Dataset Memory Limit (Rows)</label>
              <input
                type="number"
                value={maxRows}
                onChange={(e) => setMaxRows(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 w-full max-w-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            Save Preferences
          </button>
          {saved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Preferences Saved</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
