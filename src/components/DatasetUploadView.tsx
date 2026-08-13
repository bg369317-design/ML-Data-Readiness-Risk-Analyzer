import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  X,
  ArrowRight,
  Zap,
  AlertCircle
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface DatasetUploadProps {
  onFileLoaded: (fileData: { fileName: string; fileSizeFormatted: string; csvText: string; rows: any[] }) => void;
  onTryDemo: () => void;
}

export const DatasetUploadView: React.FC<DatasetUploadProps> = ({
  onFileLoaded,
  onTryDemo
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState<{
    fileName: string;
    fileSizeFormatted: string;
    csvText: string;
    rows: any[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    const sizeInKB = (file.size / 1024).toFixed(1);
    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${sizeInKB} KB`;

    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (extension === 'csv' || extension === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setFileDetails({
                fileName,
                fileSizeFormatted: formattedSize,
                csvText: text,
                rows: results.data
              });
            } else {
              setErrorMsg('Parsed file is empty or missing headers.');
            }
          },
          error: (err) => {
            setErrorMsg(`CSV Parse Error: ${err.message}`);
          }
        });
      };
      reader.readAsText(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonRows = XLSX.utils.sheet_to_json(worksheet);
          const csvText = XLSX.utils.sheet_to_csv(worksheet);

          if (jsonRows.length > 0) {
            setFileDetails({
              fileName,
              fileSizeFormatted: formattedSize,
              csvText,
              rows: jsonRows
            });
          } else {
            setErrorMsg('Excel sheet is empty.');
          }
        } catch (err: any) {
          setErrorMsg(`Excel Reading Error: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setErrorMsg('Unsupported format. Please upload a .csv or .xlsx file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (fileDetails) {
      onFileLoaded(fileDetails);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-slate-100">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Upload Your Dataset
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Upload a raw tabular dataset in CSV or XLSX format to run comprehensive ML risk profiling and leakage checks.
        </p>
      </div>

      {/* Preset Demo CTA */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Don't have a dataset ready?</h3>
            <p className="text-xs text-slate-400">
              Run our pre-packaged deliberate-flaws dataset containing customer churn with realistic data leakage.
            </p>
          </div>
        </div>
        <button
          onClick={onTryDemo}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shrink-0 active:scale-95 shadow-md shadow-amber-500/20"
        >
          ⚡ Try Demo Dataset
        </button>
      </div>

      {/* Drag & Drop Area */}
      {!fileDetails ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01]'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            accept=".csv,.xlsx,.xls,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer space-y-4 block">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <p className="text-base font-bold text-white">Upload Your Dataset</p>
              <p className="text-xs text-slate-400 mt-1">Drag & Drop your file here or click to browse</p>
            </div>

            <div className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md transition-all">
              Browse Files
            </div>

            <p className="text-[11px] text-slate-500">
              Supported Formats: CSV / XLSX (Up to 50MB)
            </p>
          </label>
        </div>
      ) : (
        /* File Uploaded Confirmation Card */
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>{fileDetails.fileName}</span>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold rounded-full border border-emerald-500/30">
                    Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{fileDetails.fileSizeFormatted}</p>
              </div>
            </div>

            <button
              onClick={() => setFileDetails(null)}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
              title="Remove File"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-center">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Rows</span>
              <p className="text-lg font-bold text-white">{fileDetails.rows.length.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Columns</span>
              <p className="text-lg font-bold text-white">{Object.keys(fileDetails.rows[0] || {}).length}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Format</span>
              <p className="text-lg font-bold text-indigo-400 uppercase">{fileDetails.fileName.split('.').pop()}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Status</span>
              <p className="text-lg font-bold text-emerald-400">Validated</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleContinue}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Continue to Dataset Configuration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
