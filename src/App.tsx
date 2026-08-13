import React, { useEffect, useState } from 'react';
import { AnalysisResults, UserProfile, PredictionType } from './types';
import { Navbar } from './components/Navbar';
import { SidebarNavigation } from './components/SidebarNavigation';
import { LandingPage } from './components/LandingPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { AuthPages } from './components/AuthPages';
import { MainDashboardView } from './components/MainDashboardView';
import { DatasetUploadView } from './components/DatasetUploadView';
import { DatasetConfigView } from './components/DatasetConfigView';
import { AnalysisProgressView } from './components/AnalysisProgressView';
import { ReadinessDashboardView } from './components/ReadinessDashboardView';
import { DetailedRiskAnalysisView } from './components/DetailedRiskAnalysisView';
import { FeatureAnalysisView } from './components/FeatureAnalysisView';
import { TargetAnalysisView } from './components/TargetAnalysisView';
import { RecommendationsView } from './components/RecommendationsView';
import { AIAssessmentView } from './components/AIAssessmentView';
import { ReportView } from './components/ReportView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { UserProfileView } from './components/UserProfileView';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  
  // Theme State ('dark' or 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Default user state is null (logged out)
  const [user, setUser] = useState<UserProfile | null>(null);

  // Authentication notice message for protected features
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [authAccountType, setAuthAccountType] = useState<'user' | 'admin'>('user');

  const [history, setHistory] = useState<any[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResults | null>(null);

  // Staged data during upload flow
  const [pendingFileData, setPendingFileData] = useState<{
    fileName: string;
    fileSizeFormatted: string;
    csvText: string;
    rows: any[];
  } | null>(null);

  const protectedTabs = [
    'dashboard',
    'upload',
    'config',
    'progress',
    'readiness',
    'risks',
    'features',
    'target',
    'recommendations',
    'ai-assessment',
    'report',
    'history',
    'settings',
    'profile',
    'admin'
  ];

  const handleNavigate = (tab: string, accountTypePreference?: 'user' | 'admin') => {
    if (!user && protectedTabs.includes(tab)) {
      setAuthNotice("Authentication required: Please log in or register to use ML Readiness Risk Analyzer features.");
      setAuthAccountType(accountTypePreference || 'user');
      setActiveTab('login');
      return;
    }

    if (user && tab === 'admin' && !user.isAdmin) {
      alert("Access Denied: Admin control panel requires an Admin Login account.");
      setActiveTab('dashboard');
      return;
    }

    setAuthNotice(null);
    if (accountTypePreference) {
      setAuthAccountType(accountTypePreference);
    }
    setActiveTab(tab);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load analysis history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Launch Demo Dataset
  const handleTryDemo = async () => {
    if (!user) {
      setAuthNotice("Authentication required: Please log in or register to run demo ML dataset audits.");
      setAuthAccountType('user');
      setActiveTab('login');
      return;
    }

    try {
      const demoRes = await fetch('/api/demo-dataset');
      if (demoRes.ok) {
        const demoData = await demoRes.json();
        setPendingFileData({
          fileName: demoData.fileName,
          fileSizeFormatted: '124.5 KB',
          csvText: demoData.csvText,
          rows: demoData.rows
        });
        setActiveTab('config');
      }
    } catch (err) {
      console.error("Failed to load demo dataset:", err);
    }
  };

  // Process File Selection
  const handleFileLoaded = (fileData: {
    fileName: string;
    fileSizeFormatted: string;
    csvText: string;
    rows: any[];
  }) => {
    setPendingFileData(fileData);
    setActiveTab('config');
  };

  // Start analysis execution
  const handleStartAnalysis = async (config: {
    predictionType: PredictionType;
    targetColumn: string;
    predictionObjective: string;
  }) => {
    if (!pendingFileData) return;

    setActiveTab('progress');

    try {
      const res = await fetch('/api/analysis/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: pendingFileData.fileName,
          csvText: pendingFileData.csvText,
          rows: pendingFileData.rows,
          predictionType: config.predictionType,
          targetColumn: config.targetColumn,
          predictionObjective: config.predictionObjective
        })
      });

      if (res.ok) {
        const resultData: AnalysisResults = await res.json();
        setCurrentAnalysis(resultData);
        await fetchHistory();
      } else {
        const errJson = await res.json();
        alert(`Analysis Error: ${errJson.error}`);
        setActiveTab('upload');
      }
    } catch (err: any) {
      console.error("Analysis initiation failed:", err);
      alert(`Network / Processing Error: ${err.message}`);
      setActiveTab('upload');
    }
  };

  // Complete progress animation
  const handleProgressComplete = () => {
    if (currentAnalysis) {
      setActiveTab('readiness');
    }
  };

  // Open historical report
  const handleSelectAnalysis = async (id: string) => {
    try {
      const res = await fetch(`/api/analysis/${id}`);
      if (res.ok) {
        const analysis: AnalysisResults = await res.json();
        setCurrentAnalysis(analysis);
        setActiveTab('readiness');
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
    }
  };

  // Delete analysis
  const handleDeleteAnalysis = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (currentAnalysis?.id === id) {
          setCurrentAnalysis(null);
        }
        await fetchHistory();
      }
    } catch (err) {
      console.error("Error deleting analysis:", err);
    }
  };

  // Clear all history for admin
  const handleClearHistory = async () => {
    setHistory([]);
    setCurrentAnalysis(null);
  };

  // Refresh AI Summary
  const handleRefreshAI = async () => {
    if (!currentAnalysis) return;
    try {
      const res = await fetch(`/api/analysis/${currentAnalysis.id}/ai-summary`, {
        method: 'POST'
      });
      if (res.ok) {
        const updatedAISummary = await res.json();
        setCurrentAnalysis(prev => prev ? { ...prev, aiSummary: updatedAISummary } : null);
      }
    } catch (err) {
      console.error("Failed to refresh AI summary:", err);
    }
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setAuthNotice(null);
    if (loggedInUser.isAdmin) {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className={`min-h-screen ${theme} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      <Navbar
        user={user}
        currentAnalysis={currentAnalysis}
        activeTab={activeTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigate={handleNavigate}
        onLogout={() => {
          setUser(null);
          setActiveTab('landing');
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <SidebarNavigation
          user={user}
          activeTab={activeTab}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onNavigate={handleNavigate}
          currentAnalysis={currentAnalysis}
          onLogout={() => {
            setUser(null);
            setActiveTab('landing');
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 pb-12 transition-colors duration-200">
          {activeTab === 'landing' && (
            <LandingPage
              user={user}
              onNavigate={handleNavigate}
              onTryDemo={handleTryDemo}
            />
          )}

          {activeTab === 'how-it-works' && (
            <HowItWorksPage onNavigate={handleNavigate} />
          )}

          {activeTab === 'login' && (
            <AuthPages
              mode="login"
              initialAccountType={authAccountType}
              authNotice={authNotice}
              onLoginSuccess={handleLoginSuccess}
              onSwitchMode={() => setActiveTab('register')}
            />
          )}

          {activeTab === 'register' && (
            <AuthPages
              mode="register"
              initialAccountType={authAccountType}
              authNotice={authNotice}
              onLoginSuccess={handleLoginSuccess}
              onSwitchMode={() => setActiveTab('login')}
            />
          )}

          {activeTab === 'admin' && user && user.isAdmin && (
            <AdminPanel
              user={user}
              history={history}
              onClearHistory={handleClearHistory}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'dashboard' && user && (
            <MainDashboardView
              history={history}
              onNavigate={handleNavigate}
              onSelectAnalysis={handleSelectAnalysis}
              onDeleteAnalysis={handleDeleteAnalysis}
              onTryDemo={handleTryDemo}
            />
          )}

          {activeTab === 'upload' && user && (
            <DatasetUploadView
              onFileLoaded={handleFileLoaded}
              onTryDemo={handleTryDemo}
            />
          )}

          {activeTab === 'config' && user && pendingFileData && (
            <DatasetConfigView
              fileData={pendingFileData}
              onStartAnalysis={handleStartAnalysis}
            />
          )}

          {activeTab === 'progress' && user && (
            <AnalysisProgressView
              fileName={pendingFileData?.fileName || 'dataset.csv'}
              onComplete={handleProgressComplete}
            />
          )}

          {activeTab === 'readiness' && user && currentAnalysis && (
            <ReadinessDashboardView
              analysis={currentAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'risks' && user && currentAnalysis && (
            <DetailedRiskAnalysisView
              analysis={currentAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'features' && user && currentAnalysis && (
            <FeatureAnalysisView
              analysis={currentAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'target' && user && currentAnalysis && (
            <TargetAnalysisView
              analysis={currentAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'recommendations' && user && currentAnalysis && (
            <RecommendationsView
              analysis={currentAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'ai-assessment' && user && currentAnalysis && (
            <AIAssessmentView
              analysis={currentAnalysis}
              onRefreshAI={handleRefreshAI}
            />
          )}

          {activeTab === 'report' && user && currentAnalysis && (
            <ReportView
              analysis={currentAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'history' && user && (
            <HistoryView
              history={history}
              onSelectAnalysis={handleSelectAnalysis}
              onDeleteAnalysis={handleDeleteAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'settings' && user && <SettingsView />}

          {activeTab === 'profile' && user && (
            <UserProfileView user={user} onUpdateUser={setUser} />
          )}
        </main>
      </div>
    </div>
  );
}
