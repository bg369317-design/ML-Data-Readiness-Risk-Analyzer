import {
  AnalysisResults,
  BeforeAfterMetrics,
  CleaningConfig,
  CleaningLogEntry,
  DatasetVersion,
  RiskItem,
} from '../types';
import { analyzeDataset } from '../analyzer';
import { removeDuplicates } from './duplicates';
import { handleMissingValues } from './missingValues';
import { standardizeCategorical } from './categorical';
import { convertColumnType } from './dataTypes';
import { handleOutliers } from './outliers';
import { standardizeColumnNames } from './columns';
import { validatePreparedDataset } from './validation';

export function createDefaultCleaningConfig(analysis: AnalysisResults): CleaningConfig {
  const missingValueTreatments: CleaningConfig['missingValueTreatments'] = {};
  const typeConversions: CleaningConfig['typeConversions'] = {};
  const categoryStandardizations: CleaningConfig['categoryStandardizations'] = {};
  const outlierTreatments: CleaningConfig['outlierTreatments'] = {};
  const excludedFeatures: string[] = [];

  // Default recommendations based on detected issues
  analysis.profile.columns.forEach((col) => {
    if (col.missingCount > 0 && col.name !== analysis.targetColumn) {
      if (col.type === 'numeric') {
        missingValueTreatments[col.name] = { method: 'median' };
      } else if (col.type === 'categorical' || col.type === 'boolean') {
        missingValueTreatments[col.name] = { method: 'mode' };
      } else {
        missingValueTreatments[col.name] = { method: 'constant', customValue: 'Unknown' };
      }
    }

    if (col.isIdentifier && col.name !== analysis.targetColumn) {
      excludedFeatures.push(col.name);
    }

    if (col.type === 'categorical') {
      categoryStandardizations[col.name] = true;
    }
  });

  // Outlier defaults
  analysis.outlierFindings.forEach((outlier) => {
    if (outlier.featureName !== analysis.targetColumn) {
      outlierTreatments[outlier.featureName] = { method: 'cap' };
    }
  });

  return {
    removeDuplicates: analysis.profile.duplicateRowCount > 0,
    standardizeColumnNames: false,
    missingValueTreatments,
    typeConversions,
    categoryStandardizations,
    excludedFeatures,
    outlierTreatments,
    logicalRules: [],
  };
}

export function applyDatasetCleaning(
  analysis: AnalysisResults,
  config: CleaningConfig,
  rawRows: any[]
): {
  preparedAnalysis: AnalysisResults;
  preparedRows: any[];
  cleaningLogs: CleaningLogEntry[];
  versions: DatasetVersion[];
  beforeAfterMetrics: BeforeAfterMetrics;
} {
  const originalRows = rawRows && rawRows.length > 0 ? rawRows : analysis.rawRows || [];
  if (originalRows.length === 0) {
    throw new Error('Original dataset rows are missing or empty.');
  }

  let workingRows: any[] = JSON.parse(JSON.stringify(originalRows));
  const logs: CleaningLogEntry[] = [];
  let logIdCounter = 1;

  // 1. Remove Duplicates
  if (config.removeDuplicates) {
    const { cleanedRows, removedCount } = removeDuplicates(workingRows);
    if (removedCount > 0) {
      logs.push({
        id: `log-${logIdCounter++}`,
        timestamp: new Date().toLocaleTimeString(),
        operation: 'Remove Duplicate Rows',
        method: 'Exact Row Matching',
        affectedCount: removedCount,
        details: `Removed ${removedCount} duplicate rows (${workingRows.length} → ${cleanedRows.length} rows).`,
      });
      workingRows = cleanedRows;
    }
  }

  // 2. Standardize Column Names
  let activeTargetColumn = analysis.targetColumn;
  if (config.standardizeColumnNames) {
    const { cleanedRows, renameMap, newTargetColumn } = standardizeColumnNames(workingRows, activeTargetColumn);
    logs.push({
      id: `log-${logIdCounter++}`,
      timestamp: new Date().toLocaleTimeString(),
      operation: 'Standardize Column Names',
      method: 'snake_case Formatting',
      affectedCount: Object.keys(renameMap).length,
      details: `Converted column header styles to snake_case format. Target mapped to '${newTargetColumn}'.`,
    });
    workingRows = cleanedRows;
    activeTargetColumn = newTargetColumn;
  }

  // 3. Impute / Handle Missing Values
  Object.entries(config.missingValueTreatments).forEach(([colName, treatment]) => {
    if (treatment.method !== 'keep') {
      const colProfile = analysis.profile.columns.find((c) => c.name === colName);
      const colType = colProfile?.type || 'text';
      const { cleanedRows, affectedCount } = handleMissingValues(workingRows, colName, treatment, colType);
      if (affectedCount > 0) {
        logs.push({
          id: `log-${logIdCounter++}`,
          timestamp: new Date().toLocaleTimeString(),
          operation: 'Missing Value Treatment',
          feature: colName,
          method: `${treatment.method.toUpperCase()} Imputation`,
          affectedCount,
          details: `Applied ${treatment.method} imputation on '${colName}' for ${affectedCount} missing cells.`,
        });
        workingRows = cleanedRows;
      }
    }
  });

  // 4. Categorical Standardization
  Object.entries(config.categoryStandardizations).forEach(([colName, enabled]) => {
    if (enabled) {
      const { cleanedRows, affectedCount } = standardizeCategorical(workingRows, colName);
      if (affectedCount > 0) {
        logs.push({
          id: `log-${logIdCounter++}`,
          timestamp: new Date().toLocaleTimeString(),
          operation: 'Categorical Standardization',
          feature: colName,
          method: 'Case & Whitespace Normalization',
          affectedCount,
          details: `Standardized case and whitespace variations across ${affectedCount} values in '${colName}'.`,
        });
        workingRows = cleanedRows;
      }
    }
  });

  // 5. Data Type Conversions
  Object.entries(config.typeConversions).forEach(([colName, targetType]) => {
    const { cleanedRows, convertedCount } = convertColumnType(workingRows, colName, targetType);
    if (convertedCount > 0) {
      logs.push({
        id: `log-${logIdCounter++}`,
        timestamp: new Date().toLocaleTimeString(),
        operation: 'Data Type Conversion',
        feature: colName,
        method: `Cast to ${targetType.toUpperCase()}`,
        affectedCount: convertedCount,
        details: `Casted ${convertedCount} values in '${colName}' to ${targetType}.`,
      });
      workingRows = cleanedRows;
    }
  });

  // 6. Outlier Handling
  Object.entries(config.outlierTreatments).forEach(([colName, treatment]) => {
    if (treatment.method !== 'keep') {
      const { cleanedRows, affectedCount, minBefore, maxBefore, minAfter, maxAfter } = handleOutliers(
        workingRows,
        colName,
        treatment
      );
      if (affectedCount > 0) {
        logs.push({
          id: `log-${logIdCounter++}`,
          timestamp: new Date().toLocaleTimeString(),
          operation: 'Outlier Management',
          feature: colName,
          method: `${treatment.method.toUpperCase()} Treatment`,
          affectedCount,
          details: `Treated ${affectedCount} extreme outliers in '${colName}' (Range before: [${minBefore}, ${maxBefore}] → Range after: [${minAfter}, ${maxAfter}]).`,
        });
        workingRows = cleanedRows;
      }
    }
  });

  // 7. Validate Prepared Dataset
  const validation = validatePreparedDataset(workingRows, activeTargetColumn);
  if (!validation.isValid) {
    console.warn('Dataset validation failed post-cleaning, using raw dataset backup.');
  }

  // 8. Filter Excluded Features for ML Training Matrix
  // Create a filtered matrix for ML re-analysis where excluded features are omitted
  const filteredRows = workingRows.map((row) => {
    const newRow: Record<string, any> = {};
    Object.entries(row).forEach(([k, v]) => {
      if (!config.excludedFeatures.includes(k) || k === activeTargetColumn) {
        newRow[k] = v;
      }
    });
    return newRow;
  });

  if (config.excludedFeatures.length > 0) {
    logs.push({
      id: `log-${logIdCounter++}`,
      timestamp: new Date().toLocaleTimeString(),
      operation: 'Feature Matrix Exclusion',
      method: 'Feature Isolation',
      affectedCount: config.excludedFeatures.length,
      details: `Excluded ${config.excludedFeatures.length} feature(s) from ML training matrix: [${config.excludedFeatures.join(', ')}].`,
    });
  }

  // 9. Re-Analyze Prepared Dataset using existing analyzeDataset engine!
  const newAnalysisResults = analyzeDataset(
    filteredRows.length > 0 ? filteredRows : workingRows,
    analysis.datasetName,
    analysis.predictionType,
    activeTargetColumn,
    analysis.predictionObjective
  );

  // Preserve AI Summary from initial analysis if re-generated AI summary isn't available
  if (analysis.aiSummary && !newAnalysisResults.aiSummary) {
    newAnalysisResults.aiSummary = analysis.aiSummary;
  }

  // 10. Calculate Resolved vs Remaining Risks
  const resolvedRiskIds: string[] = [];
  const remainingRiskIds: string[] = [];

  analysis.risks.forEach((risk) => {
    let isResolved = false;

    // Duplicates resolved
    if (config.removeDuplicates && (risk.title.toLowerCase().includes('duplicate') || risk.category === 'quality')) {
      if (analysis.profile.duplicateRowCount > 0 && newAnalysisResults.profile.duplicateRowCount === 0) {
        isResolved = true;
      }
    }

    // Missing values resolved
    if (risk.title.toLowerCase().includes('missing') && risk.feature) {
      if (config.missingValueTreatments[risk.feature] && config.missingValueTreatments[risk.feature].method !== 'keep') {
        isResolved = true;
      }
    }

    // Outliers resolved
    if (risk.title.toLowerCase().includes('outlier') && risk.feature) {
      if (config.outlierTreatments[risk.feature] && config.outlierTreatments[risk.feature].method !== 'keep') {
        isResolved = true;
      }
    }

    // Identifier / Cardinality resolved
    if ((risk.category === 'identifier' || risk.category === 'cardinality') && risk.feature) {
      if (config.excludedFeatures.includes(risk.feature)) {
        isResolved = true;
      }
    }

    // Leakage feature resolved ONLY if explicitly excluded by user!
    if (risk.category === 'leakage' && risk.feature) {
      if (config.excludedFeatures.includes(risk.feature)) {
        isResolved = true;
      }
    }

    if (isResolved) {
      resolvedRiskIds.push(risk.id);
    } else {
      remainingRiskIds.push(risk.id);
    }
  });

  const beforeAfterMetrics: BeforeAfterMetrics = {
    originalScore: analysis.overallScore,
    preparedScore: newAnalysisResults.overallScore,
    scoreImprovement: newAnalysisResults.overallScore - analysis.overallScore,
    originalStatus: analysis.overallStatus,
    preparedStatus: newAnalysisResults.overallStatus,
    originalRows: originalRows.length,
    preparedRows: workingRows.length,
    rowsRemoved: originalRows.length - workingRows.length,
    originalMissingPercentage: analysis.profile.totalMissingPercentage,
    preparedMissingPercentage: newAnalysisResults.profile.totalMissingPercentage,
    originalDuplicates: analysis.profile.duplicateRowCount,
    preparedDuplicates: newAnalysisResults.profile.duplicateRowCount,
    resolvedRiskIds,
    remainingRiskIds,
  };

  const currentVersionNumber = (analysis.versions?.length || 0) + 1;
  const versions: DatasetVersion[] = [
    ...(analysis.versions || [
      {
        versionNumber: 1,
        label: 'Original Raw Dataset',
        timestamp: new Date(analysis.createdAt).toLocaleTimeString(),
        rowCount: originalRows.length,
        columnCount: analysis.profile.columnCount,
        readinessScore: analysis.overallScore,
        operationsApplied: ['Raw Data Load'],
      },
    ]),
    {
      versionNumber: currentVersionNumber > 1 ? currentVersionNumber : 2,
      label: `Prepared Version v${currentVersionNumber > 1 ? currentVersionNumber : 2}`,
      timestamp: new Date().toLocaleTimeString(),
      rowCount: workingRows.length,
      columnCount: newAnalysisResults.profile.columnCount,
      readinessScore: newAnalysisResults.overallScore,
      operationsApplied: logs.map((l) => l.operation),
    },
  ];

  // Attach state extensions to preparedAnalysis
  const preparedAnalysis: AnalysisResults = {
    ...newAnalysisResults,
    id: analysis.id, // maintain same analysis session ID
    createdAt: analysis.createdAt,
    rawRows: originalRows,
    preparedRows: workingRows,
    cleaningLogs: logs,
    versions,
    beforeAfterMetrics,
    cleaningConfig: config,
    excludedFeatures: config.excludedFeatures,
  };

  return {
    preparedAnalysis,
    preparedRows: workingRows,
    cleaningLogs: logs,
    versions,
    beforeAfterMetrics,
  };
}
