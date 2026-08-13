import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Building, ShieldCheck, Check } from 'lucide-react';

interface UserProfileProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const UserProfileView: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [organization, setOrganization] = useState(user.organization);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      role,
      organization
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <User className="w-6 h-6 text-indigo-400" />
          <span>User Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account credentials, role designation, and organizational unit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-indigo-600/20 border-2 border-indigo-500 text-indigo-300 font-bold text-xl flex items-center justify-center">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
              {role}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Role / Job Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            Update Profile
          </button>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Profile Updated</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
