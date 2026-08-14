import React from 'react';
import {
  Copy,
  AlertCircle,
  Hash,
  ShieldAlert,
  Sliders,
  Type,
  CheckCircle,
  Eye,
  Info,
  Lock,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { AnalysisResults, CleaningConfig, MissingTreatmentConfig, OutlierTreatmentConfig } from '../../types';

interface IssueCardProps {
  analysis: AnalysisResults;
  config: CleaningConfig;
  onChangeConfig: (newConfig: CleaningConfig) => void;
  onPreviewChanges: () => void;
}

export const CleaningIssueCard: React.FC<IssueCardProps> = ({
  analysis,
  config,
  onChangeConfig,
  onPreviewChanges,
}) => {
  const duplicateRows = analysis.profile.duplicateRowCount;
  const duplicatePct = analysis.profile.duplicateRowPercentage;

  const missingColumns = analysis.profile.columns.filter((c) => c.missingCount > 0);
  const identifierColumns = analysis.profile.columns.filter((c) => c.isIdentifier && c.name !== analysis.targetColumn);
  const highCardinalityColumns = analysis.profile.columns.filter((c) => c.isHighCardinality && c.name !== analysis.targetColumn);
  const categoricalColumns = analysis.profile.columns.filter((c) => c.type === 'categorical' && c.name !== analysis.targetColumn);

  const handleToggleDuplicates = (val: boolean) => {
    onChangeConfig({ ...config, removeDuplicates: val });
  };

  const handleMissingChange = (colName: string, method: MissingTreatmentConfig['method'], customValue?: string) => {
    const updated = { ...config.missingValueTreatments };
    updated[colName] = { method, customValue };
    onChangeConfig({ ...config, missingValueTreatments: updated });
  };

  const handleOutlierChange = (colName: string, method: OutlierTreatmentConfig['method']) => {
    const updated = { ...config.outlierTreatments };
    updated[colName] = { method };
    onChangeConfig({ ...config, outlierTreatments: updated });
  };

  const handleToggleExcludeFeature = (colName: string) => {
    const exists = config.excludedFeatures.includes(colName);
    const updated = exists
      ? config.excludedFeatures.filter((f) => f !== colName)
      : [...config.excludedFeatures, colName];
    onChangeConfig({ ...config, excludedFeatures: updated });
  };

  const handleToggleCategorical = (colName: string) => {
    const updated = { ...config.categoryStandardizations };
    updated[colName] = !updated[colName];
    onChangeConfig({ ...config, categoryStandardizations: updated });
  };

  return (
    <div className="space-y-6">
      {/* 1. Duplicate Rows Section */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Duplicate Rows Management
              </h3>
              <p className="text-xs text-slate-500">
                Identify and remove exact duplicate records across the dataset.
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            duplicateRows > 0 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          }`}>
            {duplicateRows > 0 ? `${duplicateRows} duplicates (${duplicatePct}%)` : '0 duplicates'}
          </span>
        </div>

        {duplicateRows > 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {duplicateRows} Duplicate Rows Detected
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Removing duplicates prevents model overfitting to repeated samples.
              </p>
            </div>
            <label className="inline-flex items-center space-x-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.removeDuplicates}
                onChange={(e) => handleToggleDuplicates(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Remove Duplicate Rows
              </span>
            </label>
          </div>
        ) : (
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Dataset contains no exact duplicate rows. Clean!</span>
          </div>
        )}
      </div>

      {/* 2. Missing Value Imputation Section */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Missing Value Treatment
              </h3>
              <p className="text-xs text-slate-500">
                Impute or handle missing cells with data-driven statistical strategies.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {missingColumns.length} features with missing values
          </span>
        </div>

        {missingColumns.length > 0 ? (
          <div className="space-y-3">
            {missingColumns.map((col) => {
              const currentTreatment = config.missingValueTreatments[col.name]?.method || (col.type === 'numeric' ? 'median' : 'mode');
              const isTarget = col.name === analysis.targetColumn;

              return (
                <div key={col.name} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{col.name}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {col.type}
                        </span>
                        {isTarget && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Target Column
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {col.missingCount} missing cells ({col.missingPercentage}%) out of {analysis.profile.rowCount.toLocaleString()} rows.
                      </p>
                    </div>

                    {!isTarget && (
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-slate-500 font-medium shrink-0">Strategy:</label>
                        <select
                          value={currentTreatment}
                          onChange={(e) => handleMissingChange(col.name, e.target.value as any)}
                          className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {col.type === 'numeric' && <option value="median">Median Imputation</option>}
                          {col.type === 'numeric' && <option value="mean">Mean Imputation</option>}
                          <option value="mode">Mode Imputation</option>
                          <option value="constant">Custom Constant</option>
                          <option value="remove">Remove Rows with Missing</option>
                          <option value="keep">Keep Raw Missing</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/40 rounded-lg text-xs text-indigo-950 dark:text-indigo-200 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Recommendation: </span>
                      {col.type === 'numeric'
                        ? `Impute with Median (${col.median ?? 'auto'}). Numerical feature with potential extreme values.`
                        : `Impute with Mode (${col.sampleValues[0] || 'auto'}). Preserves category frequencies.`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>0 missing cells across all columns. Data completeness is 100%!</span>
          </div>
        )}
      </div>

      {/* 3. Potential Data Leakage & Identifier Isolation (Human-In-The-Loop) */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                ML Feature Matrix Isolation (Leakage &amp; Identifiers)
              </h3>
              <p className="text-xs text-slate-500">
                Exclude variables that contain post-outcome information or high-cardinality IDs from the training matrix.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            Human-in-the-Loop Review
          </span>
        </div>

        {/* Leakage features */}
        {analysis.leakageFindings.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Potential Data Leakage Features ({analysis.leakageFindings.length})
            </h4>
            {analysis.leakageFindings.map((leak) => {
              const isExcluded = config.excludedFeatures.includes(leak.featureName);

              return (
                <div
                  key={leak.featureName}
                  className={`p-4 border rounded-xl transition-all ${
                    isExcluded
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-rose-500/5 border-rose-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {leak.featureName}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                          {leak.severity} Leakage Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-semibold">Reason: </span>
                        {leak.reason} ({leak.evidence})
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleExcludeFeature(leak.featureName)}
                      className={`px-3.5 py-2 text-xs font-extrabold rounded-lg transition-all shrink-0 flex items-center space-x-1.5 ${
                        isExcluded
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                      }`}
                    >
                      {isExcluded ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Excluded from ML Matrix</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Exclude Feature</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Identifiers & High Cardinality */}
        {(identifierColumns.length > 0 || highCardinalityColumns.length > 0) && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Identifier &amp; High Cardinality Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...identifierColumns, ...highCardinalityColumns].map((col) => {
                const isExcluded = config.excludedFeatures.includes(col.name);

                return (
                  <div
                    key={col.name}
                    className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {col.name}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {col.isIdentifier ? '100% unique identifier' : `${col.uniqueCount} unique categories`}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleExcludeFeature(col.name)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        isExcluded
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      {isExcluded ? 'Excluded' : 'Exclude'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Categorical Standardization & Outliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categorical Standardization */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <Type className="w-5 h-5 text-purple-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Categorical Case Normalization
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Standardize whitespace, lowercasing, and case variations across categorical variables.
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {categoricalColumns.map((col) => {
              const isEnabled = config.categoryStandardizations[col.name] !== false;

              return (
                <div key={col.name} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{col.name}</span>
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggleCategorical(col.name)}
                      className="w-3.5 h-3.5 text-purple-600 rounded border-slate-300"
                    />
                    <span className="text-[11px] text-slate-500">Standardize</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outlier Management */}
        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <Sliders className="w-5 h-5 text-sky-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Outlier Cap &amp; Winsorization
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Cap extreme values at 1.5x IQR bounds to protect model gradient stability.
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {analysis.outlierFindings.map((outlier) => {
              const currentTreatment = config.outlierTreatments[outlier.featureName]?.method || 'cap';

              return (
                <div key={outlier.featureName} className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{outlier.featureName}</span>
                    <span className="text-[10px] text-slate-500 block">{outlier.outlierCount} outliers</span>
                  </div>

                  <select
                    value={currentTreatment}
                    onChange={(e) => handleOutlierChange(outlier.featureName, e.target.value as any)}
                    className="text-[11px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="cap">Cap at IQR</option>
                    <option value="log">Log1p Transform</option>
                    <option value="remove">Remove Outlier Rows</option>
                    <option value="keep">Keep Raw Values</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
