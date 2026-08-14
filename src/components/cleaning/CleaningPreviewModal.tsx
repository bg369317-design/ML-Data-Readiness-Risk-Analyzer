import React from 'react';
import { X, CheckCircle, AlertTriangle, Layers, Database, ArrowRight } from 'lucide-react';
import { AnalysisResults, CleaningConfig, MissingTreatmentConfig, OutlierTreatmentConfig } from '../../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmApply: () => void;
  analysis: AnalysisResults;
  config: CleaningConfig;
}

export const CleaningPreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirmApply,
  analysis,
  config,
}) => {
  if (!isOpen) return null;

  const totalRows = analysis.profile.rowCount;
  const duplicateRows = analysis.profile.duplicateRowCount;

  const missingTreatmentsCount = (Object.values(config.missingValueTreatments) as MissingTreatmentConfig[]).filter(
    (t) => t.method !== 'keep'
  ).length;

  const outlierTreatmentsCount = (Object.values(config.outlierTreatments) as OutlierTreatmentConfig[]).filter(
    (t) => t.method !== 'keep'
  ).length;

  const excludedFeaturesCount = config.excludedFeatures.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Proposed Cleaning Changes</h3>
              <p className="text-xs text-slate-500">Review selected transformations before applying</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Change list */}
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Remove Duplicate Rows</span>
              </span>
              <span className={config.removeDuplicates ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}>
                {config.removeDuplicates ? `☑ Remove ${duplicateRows} duplicates` : '☐ Skipped'}
              </span>
            </div>
            {config.removeDuplicates && (
              <p className="text-[11px] text-slate-500">
                Rows before: {totalRows.toLocaleString()} → Rows after: {(totalRows - duplicateRows).toLocaleString()}
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-amber-500" />
                <span>Missing Value Imputations</span>
              </span>
              <span className="text-indigo-600 font-extrabold">
                {missingTreatmentsCount} features configured
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Feature Matrix Exclusions</span>
              </span>
              <span className={excludedFeaturesCount > 0 ? 'text-rose-600 font-extrabold' : 'text-slate-400'}>
                {excludedFeaturesCount} features excluded
              </span>
            </div>
            {excludedFeaturesCount > 0 && (
              <p className="text-[11px] text-slate-500 truncate">
                Excluded: [{config.excludedFeatures.join(', ')}]
              </p>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span>Outlier Treatments</span>
              <span className="text-sky-600 font-extrabold">{outlierTreatmentsCount} features</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
          <p className="font-bold">Original Raw Dataset Preserved</p>
          <p className="text-[11px] opacity-90">
            Applying changes creates a new prepared version and triggers an immediate re-analysis without overwriting your original dataset.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmApply();
              onClose();
            }}
            className="px-5 py-2 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <span>Apply Selected Changes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
