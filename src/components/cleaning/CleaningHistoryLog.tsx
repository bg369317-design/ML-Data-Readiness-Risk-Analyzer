import React from 'react';
import { History, Clock, FileCheck2, Filter, Layers, Database } from 'lucide-react';
import { CleaningLogEntry, DatasetVersion } from '../../types';

interface HistoryLogProps {
  logs: CleaningLogEntry[];
  versions: DatasetVersion[];
}

export const CleaningHistoryLog: React.FC<HistoryLogProps> = ({ logs, versions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Transformation Audit Trail Logs */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Data Transformation Audit Trail
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {logs.length} operations logged
          </span>
        </div>

        {logs.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white">{log.operation}</span>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  <span>Method: {log.method}</span>
                  {log.feature && <span>• Feature: '{log.feature}'</span>}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{log.details}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No transformations applied yet. Select cleaning actions above and click "Apply Selected Changes".
          </div>
        )}
      </div>

      {/* Dataset Version History */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <Layers className="w-5 h-5 text-purple-500" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Dataset Version History
          </h3>
        </div>

        <div className="space-y-3">
          {versions.map((ver) => (
            <div
              key={ver.versionNumber}
              className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1 text-xs"
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900 dark:text-white">{ver.label}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{ver.readinessScore}/100 Score</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {ver.rowCount.toLocaleString()} rows • {ver.columnCount} columns • {ver.timestamp}
              </p>
              <div className="pt-1 flex flex-wrap gap-1">
                {ver.operationsApplied.map((op, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {op}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
