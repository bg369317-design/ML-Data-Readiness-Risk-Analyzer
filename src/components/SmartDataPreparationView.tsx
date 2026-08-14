import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Download,
  RotateCcw,
  Sparkles,
  Play,
  FileSpreadsheet,
  Layers,
  History,
  BarChart2,
  CheckCircle2,
  Wand2,
} from 'lucide-react';
import { AnalysisResults, CleaningConfig } from '../types';
import { applyDatasetCleaning, createDefaultCleaningConfig } from '../cleaning';
import { CleaningSummaryHeader } from './cleaning/CleaningSummaryHeader';
import { CleaningIssueCard } from './cleaning/CleaningIssueCard';
import { CleaningPreviewModal } from './cleaning/CleaningPreviewModal';
import { BeforeAfterComparison } from './cleaning/BeforeAfterComparison';
import { CleaningHistoryLog } from './cleaning/CleaningHistoryLog';

interface SmartDataPreparationProps {
  analysis: AnalysisResults;
  onUpdateAnalysis: (updatedAnalysis: AnalysisResults) => void;
  onNavigate: (tab: string) => void;
}

export const SmartDataPreparationView: React.FC<SmartDataPreparationProps> = ({
  analysis,
  onUpdateAnalysis,
  onNavigate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'configure' | 'comparison' | 'logs'>('configure');
  const [config, setConfig] = useState<CleaningConfig>(() =>
    analysis.cleaningConfig || createDefaultCleaningConfig(analysis)
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Apply Selected Cleaning Operations
  const handleApplyChanges = async () => {
    setIsApplying(true);
    try {
      // Execute cleaning pipeline
      const { preparedAnalysis } = applyDatasetCleaning(
        analysis,
        config,
        analysis.rawRows || []
      );

      // Optionally call server API to update analysis store
      try {
        await fetch(`/api/analysis/${analysis.id}/clean`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config,
            preparedRows: preparedAnalysis.preparedRows,
            beforeAfterMetrics: preparedAnalysis.beforeAfterMetrics,
            cleaningLogs: preparedAnalysis.cleaningLogs,
            versions: preparedAnalysis.versions,
          }),
        });
      } catch (_e) {
        // Fallback gracefully to in-session state update
      }

      onUpdateAnalysis(preparedAnalysis);
      setActiveSubTab('comparison');
    } catch (err: any) {
      alert(`Data Preparation Failed: ${err.message || err}`);
    } finally {
      setIsApplying(false);
    }
  };

  // Reset to Original Raw Dataset
  const handleRestoreOriginal = () => {
    if (!analysis.rawRows || analysis.rawRows.length === 0) return;
    const defaultConfig = createDefaultCleaningConfig(analysis);
    setConfig(defaultConfig);

    const restoredAnalysis = { ...analysis };
    delete restoredAnalysis.beforeAfterMetrics;
    restoredAnalysis.cleaningLogs = [];
    restoredAnalysis.preparedRows = analysis.rawRows;

    onUpdateAnalysis(restoredAnalysis);
    setActiveSubTab('configure');
  };

  // Export prepared dataset as CSV
  const handleDownloadCSV = () => {
    const rowsToExport = analysis.preparedRows || analysis.rawRows || [];
    if (rowsToExport.length === 0) {
      alert('No prepared rows available to download.');
      return;
    }

    const csvString = Papa.unparse(rowsToExport);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prepared_${analysis.datasetName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export prepared dataset as XLSX
  const handleDownloadXLSX = () => {
    const rowsToExport = analysis.preparedRows || analysis.rawRows || [];
    if (rowsToExport.length === 0) {
      alert('No prepared rows available to download.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prepared Dataset');
    const fileName = `prepared_${analysis.datasetName.replace(/\.[^/.]+$/, '')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Banner Summary */}
      <CleaningSummaryHeader
        analysis={analysis}
        issuesCount={analysis.risks.length}
        recommendationsCount={analysis.recommendations.length}
      />

      {/* Action Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm">
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setActiveSubTab('configure')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'configure'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Configure Cleaning Actions</span>
          </button>

          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'comparison'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Before / After Comparison</span>
            {analysis.beforeAfterMetrics && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'logs'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Cleaning Log &amp; Versions</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {analysis.beforeAfterMetrics && (
            <button
              onClick={handleRestoreOriginal}
              className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Raw Dataset</span>
            </button>
          )}

          <div className="flex items-center space-x-1">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-2 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleDownloadXLSX}
              className="px-3 py-2 text-xs font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>XLSX</span>
            </button>
          </div>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Preview &amp; Apply Changes</span>
          </button>
        </div>
      </div>

      {/* Active Sub-Tab View */}
      {activeSubTab === 'configure' && (
        <CleaningIssueCard
          analysis={analysis}
          config={config}
          onChangeConfig={setConfig}
          onPreviewChanges={() => setIsPreviewOpen(true)}
        />
      )}

      {activeSubTab === 'comparison' && (
        <BeforeAfterComparison analysis={analysis} />
      )}

      {activeSubTab === 'logs' && (
        <CleaningHistoryLog
          logs={analysis.cleaningLogs || []}
          versions={analysis.versions || []}
        />
      )}

      {/* Preview Confirmation Modal */}
      <CleaningPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirmApply={handleApplyChanges}
        analysis={analysis}
        config={config}
      />
    </div>
  );
};
