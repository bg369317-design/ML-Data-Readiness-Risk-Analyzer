import React, { useState } from 'react';
import { Sliders, Target, HelpCircle, ArrowRight, Play, Info } from 'lucide-react';
import { PredictionType } from '../types';

interface DatasetConfigProps {
  fileData: { fileName: string; fileSizeFormatted: string; csvText: string; rows: any[] };
  onStartAnalysis: (config: {
    predictionType: PredictionType;
    targetColumn: string;
    predictionObjective: string;
  }) => void;
}

export const DatasetConfigView: React.FC<DatasetConfigProps> = ({
  fileData,
  onStartAnalysis
}) => {
  const columns = Object.keys(fileData.rows[0] || {});
  
  // Default target guesses (e.g. churn, target, label, price, or last column)
  const defaultTarget = columns.find(c => {
    const l = c.toLowerCase();
    return l.includes('churn') || l.includes('target') || l.includes('label') || l.includes('status');
  }) || columns[columns.length - 1] || '';

  const [predictionType, setPredictionType] = useState<PredictionType>('classification');
  const [targetColumn, setTargetColumn] = useState<string>(defaultTarget);
  const [predictionObjective, setPredictionObjective] = useState<string>(
    defaultTarget ? `Predict ${defaultTarget} for new records` : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartAnalysis({
      predictionType,
      targetColumn: predictionType === 'clustering' ? '' : targetColumn,
      predictionObjective
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 text-slate-100">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configure Your ML Objective
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Specify what you intend to predict. The same dataset can be highly suitable for one ML objective but problematic or invalid for another.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Dataset Summary Pill */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Dataset:</span>{' '}
            <strong className="text-white font-bold">{fileData.fileName}</strong>
          </div>
          <div className="text-slate-400">
            {fileData.rows.length.toLocaleString()} rows × {columns.length} columns
          </div>
        </div>

        {/* 1. Prediction Type Radio Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Select Prediction Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'classification',
                label: 'Classification',
                desc: 'Predict discrete classes or labels (e.g., Churn / Stayed)'
              },
              {
                id: 'regression',
                label: 'Regression',
                desc: 'Predict continuous numerical values (e.g., Revenue, Price)'
              },
              {
                id: 'clustering',
                label: 'Clustering',
                desc: 'Unsupervised grouping without a target variable'
              }
            ].map(item => (
              <label
                key={item.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  predictionType === item.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="predictionType"
                    value={item.id}
                    checked={predictionType === item.id}
                    onChange={() => setPredictionType(item.id as PredictionType)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-sm text-white">{item.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-snug">{item.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Target Column Dropdown (If Supervised) */}
        {predictionType !== 'clustering' ? (
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Column
            </label>
            <div className="relative">
              <Target className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={targetColumn}
                onChange={(e) => {
                  setTargetColumn(e.target.value);
                  setPredictionObjective(`Predict whether ${e.target.value} occurs for new data`);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              >
                {columns.map(col => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Select the feature you want your model to learn to predict.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Clustering task selected. No target column is required.</span>
          </div>
        )}

        {/* 3. Prediction Objective Text Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Prediction Objective (Optional)
          </label>
          <input
            type="text"
            value={predictionObjective}
            onChange={(e) => setPredictionObjective(e.target.value)}
            placeholder="e.g. Predict whether a customer will churn in the next 30 days"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Informational Callout */}
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-start space-x-3">
          <Info className="w-5 h-5 shrink-0 text-indigo-400 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Contextual Readiness Risk Framework</p>
            <p className="text-[11px] text-indigo-200/80 mt-0.5">
              Target class distribution and data leakage risks are calculated relative to your selected target variable and objective type.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Risk Analysis Engine</span>
        </button>
      </form>
    </div>
  );
};
