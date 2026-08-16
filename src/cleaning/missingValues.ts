import { ColumnProfile, MissingTreatmentConfig } from '../types';

export function calculateColumnStats(rows: any[], colName: string) {
  const rawValues = rows.map((r) => r[colName]);
  const validValues: any[] = [];
  const numericValues: number[] = [];
  const valueCounts: Record<string, number> = {};

  rawValues.forEach((val) => {
    if (val !== null && val !== undefined && String(val).trim() !== '' && val !== 'null' && val !== 'NaN' && val !== 'N/A') {
      validValues.push(val);
      const strVal = String(val).trim();
      valueCounts[strVal] = (valueCounts[strVal] || 0) + 1;
      const num = Number(strVal);
      if (!isNaN(num)) {
        numericValues.push(num);
      }
    }
  });

  // Calculate Median
  let median = 0;
  let mean = 0;
  if (numericValues.length > 0) {
    const sorted = [...numericValues].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    mean = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;
  }

  // Calculate Mode
  let mode = '';
  let maxCount = 0;
  Object.entries(valueCounts).forEach(([val, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mode = val;
    }
  });

  return {
    total: rows.length,
    missingCount: rows.length - validValues.length,
    validCount: validValues.length,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    mode: mode || 'Unknown',
  };
}

export function recommendMissingTreatment(col: ColumnProfile, stats: ReturnType<typeof calculateColumnStats>) {
  if (col.type === 'numeric') {
    if (col.skewness && Math.abs(col.skewness) > 1) {
      return {
        method: 'median' as const,
        reason: 'Numerical feature with skewed distribution. Median avoids distortion from extreme values.',
        val: stats.median,
      };
    }
    return {
      method: 'median' as const,
      reason: 'Numerical feature. Median imputation preserves distribution central tendency.',
      val: stats.median,
    };
  } else if (col.type === 'categorical' || col.type === 'boolean') {
    return {
      method: 'mode' as const,
      reason: 'Categorical feature. Mode imputation replaces missing values with the most frequent category.',
      val: stats.mode,
    };
  } else {
    return {
      method: 'constant' as const,
      reason: 'Text or unstructured feature. Imputing with "Unknown" flags missingness clearly.',
      val: 'Unknown',
    };
  }
}

export function handleMissingValues(
  rows: any[],
  columnName: string,
  config: MissingTreatmentConfig,
  columnType: ColumnProfile['type']
): { cleanedRows: any[]; affectedCount: number } {
  if (!rows || rows.length === 0) return { cleanedRows: [], affectedCount: 0 };

  const stats = calculateColumnStats(rows, columnName);
  let replacementValue: any = '';

  if (config.method === 'median') {
    replacementValue = stats.median;
  } else if (config.method === 'mean') {
    replacementValue = stats.mean;
  } else if (config.method === 'mode') {
    replacementValue = stats.mode;
  } else if (config.method === 'constant') {
    replacementValue = config.customValue !== undefined && config.customValue !== '' ? config.customValue : 'Unknown';
  } else if (config.method === 'remove') {
    const cleanedRows = rows.filter((r) => {
      const v = r[columnName];
      return v !== null && v !== undefined && v !== '' && v !== 'null' && v !== 'NaN' && v !== 'N/A';
    });
    return { cleanedRows, affectedCount: rows.length - cleanedRows.length };
  } else if (config.method === 'keep') {
    return { cleanedRows: [...rows], affectedCount: 0 };
  }

  let affectedCount = 0;
  const cleanedRows = rows.map((row) => {
    const val = row[columnName];
    const isMissing = val === null || val === undefined || val === '' || val === 'null' || val === 'NaN' || val === 'N/A';

    if (isMissing) {
      affectedCount++;
      return { ...row, [columnName]: replacementValue };
    }
    return row;
  });

  return { cleanedRows, affectedCount };
}
