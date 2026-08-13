import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  ShieldCheck,
  Sliders,
  Users,
  Activity,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Server,
  Key,
  FileSpreadsheet,
  Trash2,
  Download,
  Info,
  UserX,
  UserCheck,
  ShieldAlert,
  Search,
  Plus,
  ArrowRight,
  Gauge,
  BarChart2,
  Eye,
  Brain,
  FileText,
  Clock,
  Settings,
  User,
  Filter,
  Lock,
  Zap,
  Bot
} from 'lucide-react';

interface AdminPanelProps {
  user: UserProfile;
  history: any[];
  onClearHistory?: () => void;
  onNavigate: (tab: string) => void;
}

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: 'admin' | 'user';
  status: 'Verified' | 'Suspicious' | 'Blocked';
  isFake: boolean;
  riskReason?: string;
  lastActive: string;
  auditsRun: number;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  user,
  history,
  onClearHistory,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'users' | 'thresholds' | 'logs' | 'system'>('tools');
  
  // Risk Threshold Config State
  const [imbalanceThreshold, setImbalanceThreshold] = useState<number>(3.0);
  const [missingnessThreshold, setMissingnessThreshold] = useState<number>(20);
  const [leakageSensitivity, setLeakageSensitivity] = useState<string>('high');
  const [geminiModel, setGeminiModel] = useState<string>('gemini-2.5-flash');
  const [savedSettings, setSavedSettings] = useState<boolean>(false);

  // Managed Users State
  const [usersList, setUsersList] = useState<ManagedUser[]>([
    {
      id: 'usr-1',
      name: 'Sarah Chen',
      email: 'admin@mldata.io',
      role: 'Data Governance Admin',
      accountType: 'admin',
      status: 'Verified',
      isFake: false,
      lastActive: 'Now (Active Admin)',
      auditsRun: 38
    },
    {
      id: 'usr-2',
      name: 'Alex Rivera',
      email: 'alex.rivera@datalab.io',
      role: 'ML Engineer',
      accountType: 'user',
      status: 'Verified',
      isFake: false,
      lastActive: '10 mins ago',
      auditsRun: 14
    },
    {
      id: 'usr-3',
      name: 'Marcus Vance',
      email: 'marcus@researchai.org',
      role: 'Data Scientist',
      accountType: 'user',
      status: 'Verified',
      isFake: false,
      lastActive: '2 hours ago',
      auditsRun: 7
    },
    {
      id: 'usr-4',
      name: 'Elena Rostova',
      email: 'elena@biotechml.com',
      role: 'Bioinformatics Lead',
      accountType: 'user',
      status: 'Verified',
      isFake: false,
      lastActive: '1 day ago',
      auditsRun: 22
    },
    {
      id: 'usr-5',
      name: 'bot_x992381',
      email: 'bot_user9812@tempmail.org',
      role: 'Automated Bot Account',
      accountType: 'user',
      status: 'Suspicious',
      isFake: true,
      riskReason: 'Disposable Email Domain & High Automated Request Spike',
      lastActive: '5 mins ago',
      auditsRun: 1
    },
    {
      id: 'usr-6',
      name: 'Test Spam Acc',
      email: 'fake_account_test@10minutemail.net',
      role: 'Unknown User',
      accountType: 'user',
      status: 'Suspicious',
      isFake: true,
      riskReason: 'Flagged Temporary Mail Domain & Unverified Identity',
      lastActive: 'Yesterday',
      auditsRun: 0
    }
  ]);

  const [userSearch, setUserSearch] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<'All' | 'Verified' | 'Suspicious' | 'Blocked'>('All');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Anti-Fake Prevention Settings
  const [blockTempMail, setBlockTempMail] = useState(true);
  const [requireAdminApproval, setRequireAdminApproval] = useState(true);
  const [enforceRateLimiting, setEnforceRateLimiting] = useState(true);

  // New User Form Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Data Analyst');
  const [newUserAccountType, setNewUserAccountType] = useState<'user' | 'admin'>('user');

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  // Anti-Fake User Automated Scan
  const handleRunAntiFakeScan = () => {
    setScanMessage("Running AI Anti-Fake User Audit...");
    setTimeout(() => {
      let flaggedCount = 0;
      const updated = usersList.map((u) => {
        const isDisposable = u.email.includes('tempmail') || u.email.includes('10minutemail') || u.email.includes('guerrillamail') || u.email.includes('fake');
        const isBotName = u.name.toLowerCase().includes('bot') || u.name.toLowerCase().includes('spam');
        if ((isDisposable || isBotName) && u.status !== 'Blocked') {
          flaggedCount++;
          return {
            ...u,
            status: 'Suspicious' as const,
            isFake: true,
            riskReason: u.riskReason || 'Flagged by Anti-Fake AI Guard (Disposable domain / Bot pattern)'
          };
        }
        return u;
      });
      setUsersList(updated);
      setScanMessage(`Scan complete: Identified ${flaggedCount} potential fake account(s).`);
      setTimeout(() => setScanMessage(null), 4000);
    }, 1200);
  };

  // Block/Unblock User
  const handleToggleBlockUser = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Blocked' ? (u.isFake ? 'Suspicious' : 'Verified') : 'Blocked';
          return { ...u, status: newStatus as any };
        }
        return u;
      })
    );
  };

  // Verify User
  const handleVerifyUser = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: 'Verified' as const, isFake: false, riskReason: undefined };
        }
        return u;
      })
    );
  };

  // Delete User
  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this user account?")) {
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  // Toggle Admin Role
  const handleToggleAdminRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            accountType: u.accountType === 'admin' ? 'user' : 'admin',
            role: u.accountType === 'admin' ? 'ML Engineer' : 'Data Governance Admin'
          };
        }
        return u;
      })
    );
  };

  // Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      accountType: newUserAccountType,
      status: 'Verified',
      isFake: false,
      lastActive: 'Just registered (Verified)',
      auditsRun: 0
    };

    setUsersList([newUser, ...usersList]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  // Filter Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (userFilterStatus === 'All') return true;
    if (userFilterStatus === 'Verified') return u.status === 'Verified';
    if (userFilterStatus === 'Suspicious') return u.status === 'Suspicious' || u.isFake;
    if (userFilterStatus === 'Blocked') return u.status === 'Blocked';
    return true;
  });

  const totalUsersCount = usersList.length;
  const verifiedUsersCount = usersList.filter((u) => u.status === 'Verified').length;
  const suspiciousCount = usersList.filter((u) => u.status === 'Suspicious' || u.isFake).length;
  const blockedCount = usersList.filter((u) => u.status === 'Blocked').length;

  // Tool directory list
  const toolsDirectory = [
    {
      id: 'dashboard',
      name: 'Main Executive Dashboard',
      category: 'Overview',
      icon: Gauge,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      description: 'High-level readiness metrics, recent audit logs, and score progression trends.'
    },
    {
      id: 'upload',
      name: 'Dataset Upload & Profiler',
      category: 'Data Ingestion',
      icon: FileSpreadsheet,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Upload CSV/XLSX files, infer ML tasks, select target columns, and kick off analysis.'
    },
    {
      id: 'readiness',
      name: 'ML Readiness Score Engine',
      category: 'Core Analysis',
      icon: ShieldCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Breakdown of Overall Readiness Score (0-100), subscores radar, and critical alerts.'
    },
    {
      id: 'risks',
      name: 'Critical Risk Matrix',
      category: 'Governance & Risk',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      description: 'In-depth breakdown of detected data risks, severity scores, and step-by-step mitigations.'
    },
    {
      id: 'leakage',
      name: 'Target Leakage Inspector',
      category: 'Feature Inspection',
      icon: Eye,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: 'Detect spurious correlations, temporal leakage, and post-event predictive features.'
    },
    {
      id: 'profiler',
      name: 'Data Quality & Feature Profiler',
      category: 'Feature Inspection',
      icon: BarChart2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Column missingness, class imbalances, outlier detection, and data type validation.'
    },
    {
      id: 'ai-assessment',
      name: 'Gemini AI Governance Advisor',
      category: 'AI Guidance',
      icon: Brain,
      color: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
      description: 'Generates executive plain-language summaries and AI-powered data preparation guidance.'
    },
    {
      id: 'report',
      name: 'Executive Audit Report',
      category: 'Exports & Audits',
      icon: FileText,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      description: 'Full compliance report generator ready for download as PDF or Markdown.'
    },
    {
      id: 'history',
      name: 'Historical Dataset Audits',
      category: 'Exports & Audits',
      icon: Clock,
      color: 'text-slate-300 bg-slate-800 border-slate-700',
      description: 'Review past dataset risk reports, re-open previous audits, or clear history.'
    },
    {
      id: 'settings',
      name: 'System & Risk Settings',
      category: 'System',
      icon: Settings,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      description: 'Configure risk threshold sensitivities, Gemini LLM model aliases, and exports.'
    },
    {
      id: 'profile',
      name: 'Admin Profile & Account',
      category: 'System',
      icon: User,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      description: 'Manage active account credentials, team role, and organization information.'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white">Admin Control Panel</h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center space-x-1">
                <span>ADMIN ACCESS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <strong className="text-slate-200">{user.name}</strong> ({user.email}) &bull; Data Governance &amp; Anti-Fake Security
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Manage Users ({usersList.length})</span>
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Launch Risk Audit</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total System Tools</span>
            <Gauge className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">11 Tools</p>
          <span className="text-[11px] text-emerald-400 font-medium">Full Unrestricted Access</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalUsersCount}</p>
          <span className="text-[11px] text-emerald-400 font-medium">{verifiedUsersCount} Verified</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Fake / Suspicious Accounts</span>
            <Bot className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">{suspiciousCount + blockedCount}</p>
          <span className="text-[11px] text-rose-400 font-medium">{blockedCount} Blocked</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Anti-Fake Firewall</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>Active</span>
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Auto-Flag Disposable Domains</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all ${
            activeTab === 'tools'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Tools Directory (Access All Tools)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all ${
            activeTab === 'users'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management &amp; Anti-Fake Guard ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('thresholds')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all ${
            activeTab === 'thresholds'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Global Risk Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all ${
            activeTab === 'logs'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Logs ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all ${
            activeTab === 'system'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Cache &amp; Utilities</span>
        </button>
      </div>

      {/* Tab 0: Tools Directory (Access Every Tool) */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Admin Tools Access Directory</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  As an Admin, you have unrestricted access to all 11 system tools and diagnostics. Click any tool below to launch into it instantly.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold self-start sm:self-auto">
                11 Tools Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolsDirectory.map((tool) => {
                const IconComp = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => onNavigate(tool.id)}
                    className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.01] cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${tool.color}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {tool.category}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center space-x-1">
                          <span>{tool.name}</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: User Management & Anti-Fake Guard */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Anti-Fake Security Firewall Rules Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Anti-Fake Account Prevention Firewall</h2>
                  <p className="text-xs text-slate-400">Enforce strict validation rules to prevent fake, bot, and temporary accounts from accessing the system.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunAntiFakeScan}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2 shrink-0"
                >
                  <Bot className="w-4 h-4" />
                  <span>Run Anti-Fake AI Audit</span>
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Verified User</span>
                </button>
              </div>
            </div>

            {scanMessage && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                <span>{scanMessage}</span>
              </div>
            )}

            {/* Anti-Fake Rules Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Block Temporary Domains</div>
                  <p className="text-[11px] text-slate-500">Auto-reject @tempmail, @10minutemail</p>
                </div>
                <input
                  type="checkbox"
                  checked={blockTempMail}
                  onChange={(e) => setBlockTempMail(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Require Admin Approval</div>
                  <p className="text-[11px] text-slate-500">Hold new accounts until verified</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireAdminApproval}
                  onChange={(e) => setRequireAdminApproval(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Rate-Limit Unverified Accounts</div>
                  <p className="text-[11px] text-slate-500">Restrict max audits per hour</p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceRateLimiting}
                  onChange={(e) => setEnforceRateLimiting(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* User Accounts Management Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Registered System Users</h2>
                <p className="text-xs text-slate-400">View, verify, elevate roles, or suspend fake accounts in real time.</p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users or email..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-semibold text-slate-400">
                  <button
                    onClick={() => setUserFilterStatus('All')}
                    className={`px-2.5 py-1 rounded ${userFilterStatus === 'All' ? 'bg-slate-800 text-white font-bold' : ''}`}
                  >
                    All ({usersList.length})
                  </button>
                  <button
                    onClick={() => setUserFilterStatus('Verified')}
                    className={`px-2.5 py-1 rounded ${userFilterStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : ''}`}
                  >
                    Verified ({verifiedUsersCount})
                  </button>
                  <button
                    onClick={() => setUserFilterStatus('Suspicious')}
                    className={`px-2.5 py-1 rounded ${userFilterStatus === 'Suspicious' ? 'bg-amber-500/20 text-amber-300 font-bold' : ''}`}
                  >
                    Fake / Suspicious ({suspiciousCount})
                  </button>
                  <button
                    onClick={() => setUserFilterStatus('Blocked')}
                    className={`px-2.5 py-1 rounded ${userFilterStatus === 'Blocked' ? 'bg-rose-500/20 text-rose-300 font-bold' : ''}`}
                  >
                    Blocked ({blockedCount})
                  </button>
                </div>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                No users found matching the filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">User &amp; Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Status / Anti-Fake Guard</th>
                      <th className="p-3">Last Active</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-medium text-white">
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                              u.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              u.status === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}>
                              {u.name[0]}
                            </div>
                            <div>
                              <div className="font-bold flex items-center space-x-1.5">
                                <span>{u.name}</span>
                                {u.status === 'Verified' && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" title="Verified Safe User" />
                                )}
                                {u.isFake && (
                                  <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 text-[9px] font-extrabold rounded uppercase">
                                    FAKE USER
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                              {u.riskReason && (
                                <div className="text-[10px] text-rose-400/90 mt-0.5 italic">
                                  ⚠️ {u.riskReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-300 font-medium">{u.role}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleAdminRole(u.id)}
                            title="Click to toggle Admin / User role"
                            className="focus:outline-none"
                          >
                            {u.accountType === 'admin' ? (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                                🛡️ ADMIN
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded border border-slate-700 hover:bg-slate-700 transition-colors">
                                USER
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="p-3">
                          {u.status === 'Verified' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                            </span>
                          )}
                          {u.status === 'Suspicious' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Flagged Fake
                            </span>
                          )}
                          {u.status === 'Blocked' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <UserX className="w-3 h-3 mr-1" /> Suspended / Blocked
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">{u.lastActive}</td>
                        <td className="p-3 text-right space-x-1">
                          {u.status !== 'Verified' && (
                            <button
                              onClick={() => handleVerifyUser(u.id)}
                              className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[10px] font-bold border border-emerald-500/30 transition-colors"
                              title="Mark user as Verified Safe"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleBlockUser(u.id)}
                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                              u.status === 'Blocked'
                                ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border-rose-500/30'
                            }`}
                            title={u.status === 'Blocked' ? 'Unblock user' : 'Suspend / Block fake user'}
                          >
                            {u.status === 'Blocked' ? 'Unblock' : 'Suspend'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Delete User Account"
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

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                    <span>Register Verified User Account</span>
                  </h3>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="text-slate-500 hover:text-white text-lg font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Dr. Jane Smith"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Work Email Address</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="jane.smith@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Role Title</label>
                    <input
                      type="text"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      placeholder="e.g. Lead ML Engineer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Account Privilege Level</label>
                    <select
                      value={newUserAccountType}
                      onChange={(e) => setNewUserAccountType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="user">Standard User (Audits &amp; Reports)</option>
                      <option value="admin">Data Governance Admin (Full Control)</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow"
                    >
                      Create Verified User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Global Risk Thresholds */}
      {activeTab === 'thresholds' && (
        <form onSubmit={handleSaveThresholds} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Configure System Risk Rules</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust how strictly the deterministic risk profiling engine triggers warnings for missing values, class imbalance, and data leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <label className="block font-bold text-slate-200">
                Class Imbalance Severity Ratio
              </label>
              <p className="text-[11px] text-slate-400">
                Triggers a High Risk classification warning when the majority-to-minority class ratio exceeds this value.
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="range"
                  min="1.5"
                  max="10.0"
                  step="0.5"
                  value={imbalanceThreshold}
                  onChange={(e) => setImbalanceThreshold(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="font-mono text-sm font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700 min-w-[50px] text-center">
                  {imbalanceThreshold.toFixed(1)}:1
                </span>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <label className="block font-bold text-slate-200">
                Missing Cell Threshold (% of column)
              </label>
              <p className="text-[11px] text-slate-400">
                Flags a feature column as incomplete if missing values exceed this percentage.
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={missingnessThreshold}
                  onChange={(e) => setMissingnessThreshold(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="font-mono text-sm font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700 min-w-[50px] text-center">
                  {missingnessThreshold}%
                </span>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <label className="block font-bold text-slate-200">
                Target Data Leakage Sensitivity
              </label>
              <p className="text-[11px] text-slate-400">
                Controls strictness when scanning for features suspiciously correlated with target or temporal indicators.
              </p>
              <select
                value={leakageSensitivity}
                onChange={(e) => setLeakageSensitivity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="strict">Strict (Flag correlation &gt; 0.75)</option>
                <option value="high">High (Flag correlation &gt; 0.85)</option>
                <option value="moderate">Moderate (Flag correlation &gt; 0.95)</option>
              </select>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <label className="block font-bold text-slate-200">
                Gemini AI Summary Model Configuration
              </label>
              <p className="text-[11px] text-slate-400">
                Select the LLM model alias used for generating plain-language executive summaries and next steps.
              </p>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest &amp; High Quality)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              Save Admin Settings
            </button>
            {savedSettings && (
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Global settings applied successfully!</span>
              </span>
            )}
          </div>
        </form>
      )}

      {/* Tab 3: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Dataset Audit Execution Log</h2>
            <p className="text-xs text-slate-400">Historical dataset readiness audits performed across the system.</p>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">No active audit records found in server database.</p>
              <p className="text-xs text-slate-500 mt-1">Run a new dataset analysis to generate logs.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Dataset Name</th>
                    <th className="p-3">Objective</th>
                    <th className="p-3">Target Column</th>
                    <th className="p-3">Readiness Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Audit Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">{item.datasetName}</td>
                      <td className="p-3 text-slate-300">{item.predictionType}</td>
                      <td className="p-3 font-mono text-indigo-400">{item.targetColumn}</td>
                      <td className="p-3 font-bold font-mono text-sm">{item.overallScore}/100</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          item.overallStatus === 'Ready' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.overallStatus === 'Needs Review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.overallStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Cache & Utilities */}
      {activeTab === 'system' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">System Utilities &amp; Storage Cache</h2>
            <p className="text-xs text-slate-400">Perform system-level maintenance and export telemetry logs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3 text-rose-400 font-bold text-sm">
                <Trash2 className="w-5 h-5" />
                <span>Clear Server Analysis History</span>
              </div>
              <p className="text-xs text-slate-400">
                Purges all cached dataset audit reports and resets historical readiness benchmarks from backend memory.
              </p>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all analysis history records?")) {
                    if (onClearHistory) onClearHistory();
                  }
                }}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg text-xs font-bold transition-all"
              >
                Clear History Cache
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3 text-indigo-400 font-bold text-sm">
                <Download className="w-5 h-5" />
                <span>Export System Audit Manifest</span>
              </div>
              <p className="text-xs text-slate-400">
                Download a JSON payload containing all active system risk rules, thresholds, and execution telemetry.
              </p>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                    exportedAt: new Date().toISOString(),
                    system: "ML Readiness Risk Analyzer Admin Manifest",
                    imbalanceThreshold,
                    missingnessThreshold,
                    leakageSensitivity,
                    geminiModel,
                    totalAudits: history.length
                  }, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `ml_audit_admin_manifest_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-bold transition-all"
              >
                Download JSON Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
