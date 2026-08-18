import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Brain, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface AuthPagesProps {
  mode: 'login' | 'register';
  initialAccountType?: 'user' | 'admin';
  authNotice?: string | null;
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  mode,
  initialAccountType = 'user',
  authNotice,
  onLoginSuccess,
  onSwitchMode
}) => {
  const [accountType, setAccountType] = useState<'user' | 'admin'>(initialAccountType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSelectAccountType = (type: 'user' | 'admin') => {
    setAccountType(type);
    setEmail('');
    setPassword('');
    setName('');
    setOrganization('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdminAccount = accountType === 'admin' || email.toLowerCase() === 'admin@mldata.io';
    const userProfile: UserProfile = {
      name: mode === 'register' ? (name || 'New User') : (name || (isAdminAccount ? 'Sarah Chen' : 'Alex Rivera')),
      email: email,
      role: isAdminAccount ? 'Data Governance Admin' : 'Lead ML Engineer',
      organization: mode === 'register' ? (organization || 'DataLab AI') : (isAdminAccount ? 'DataLab AI - Governance' : 'DataLab AI'),
      accountType: isAdminAccount ? 'admin' : 'user',
      isAdmin: isAdminAccount
    };
    onLoginSuccess(userProfile);
  };

  const handleQuickLogin = (type: 'user' | 'admin') => {
    const quickUser: UserProfile = type === 'admin' ? {
      name: 'Sarah Chen',
      email: 'admin@mldata.io',
      role: 'Data Governance Admin',
      organization: 'DataLab AI - Governance',
      accountType: 'admin',
      isAdmin: true
    } : {
      name: 'Alex Rivera',
      email: 'alex.rivera@datalab.io',
      role: 'Lead ML Engineer',
      organization: 'DataLab AI',
      accountType: 'user',
      isAdmin: false
    };
    onLoginSuccess(quickUser);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
        
        {/* Authentication Notice Banner if redirected */}
        {authNotice && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-amber-900 dark:text-amber-200">Access Restricted</strong>
              <span>{authNotice}</span>
            </div>
          </div>
        )}

        {/* Form Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            {accountType === 'admin' ? (
              <ShieldCheck className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            ) : (
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'login' ? (accountType === 'admin' ? 'Admin Portal Login' : 'User Login') : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? (accountType === 'admin'
                  ? 'Access ML Risk Analyzer with full system administration privileges'
                  : 'Log in to audit dataset ML readiness & pre-training risks')
              : 'Register to start auditing datasets before training'}
          </p>
        </div>

        {/* Separate User Login vs Admin Login Tabs/Buttons */}
        {mode === 'login' && (
          <div className="mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleSelectAccountType('user')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                accountType === 'user'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectAccountType('admin')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                accountType === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Jane Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-10 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Company or Research Lab"
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 rounded-lg font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 mt-6 ${
              accountType === 'admin'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <span>
              {mode === 'login'
                ? (accountType === 'admin' ? 'Log In as Admin' : 'Log In as User')
                : 'Create Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode === 'login' ? (
          accountType === 'user' && (
            <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
              <p>
                Don't have an account?{' '}
                <button onClick={() => onSwitchMode('register')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Register here
                </button>
              </p>
            </div>
          )
        ) : (
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            <p>
              Already have an account?{' '}
              <button onClick={() => onSwitchMode('login')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Log in here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
