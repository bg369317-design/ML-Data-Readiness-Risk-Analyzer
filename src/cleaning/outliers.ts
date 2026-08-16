import { OutlierFinding, OutlierTreatmentConfig } from '../types';

export function calculateIQRBounds(rows: any[], columnName: string) {
  const numericValues = rows
    .map((r) => r[columnName])
    .filter((val) => val !== null && val !== undefined && String(val).trim() !== '' && val !== 'null' && val !== 'NaN' && val !== 'N/A')
    .map((v) => Number(v))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  if (numericValues.length === 0) {
    return { q1: 0, q3: 0, iqr: 0, lowerBound: 0, upperBound: 0, outlierCount: 0 };
  }

  const q1Index = Math.floor(numericValues.length * 0.25);
  const q3Index = Math.floor(numericValues.length * 0.75);
  const q1 = numericValues[q1Index];
  const q3 = numericValues[q3Index];
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outlierCount = numericValues.filter((v) => v < lowerBound || v > upperBound).length;

  return { q1, q3, iqr, lowerBound, upperBound, outlierCount };
}

export function handleOutliers(
  rows: any[],
  columnName: string,
  config: OutlierTreatmentConfig
): { cleanedRows: any[]; affectedCount: number; minBefore: number; maxBefore: number; minAfter: number; maxAfter: number } {
  const bounds = calculateIQRBounds(rows, columnName);
  let affectedCount = 0;

  const numericValsBefore = rows
    .map((r) => r[columnName])
    .filter((val) => val !== null && val !== undefined && String(val).trim() !== '' && val !== 'null' && val !== 'NaN' && val !== 'N/A')
    .map((v) => Number(v))
    .filter((n) => !isNaN(n));
  const minBefore = numericValsBefore.length ? Math.min(...numericValsBefore) : 0;
  const maxBefore = numericValsBefore.length ? Math.max(...numericValsBefore) : 0;

  if (config.method === 'keep') {
    return { cleanedRows: [...rows], affectedCount: 0, minBefore, maxBefore, minAfter: minBefore, maxAfter: maxBefore };
  }

  if (config.method === 'remove') {
    const cleanedRows = rows.filter((r) => {
      const num = Number(r[columnName]);
      if (isNaN(num)) return true;
      const isOutlier = num < bounds.lowerBound || num > bounds.upperBound;
      if (isOutlier) affectedCount++;
      return !isOutlier;
    });

    const numericValsAfter = cleanedRows.map((r) => Number(r[columnName])).filter((n) => !isNaN(n));
    const minAfter = numericValsAfter.length ? Math.min(...numericValsAfter) : 0;
    const maxAfter = numericValsAfter.length ? Math.max(...numericValsAfter) : 0;

    return { cleanedRows, affectedCount, minBefore, maxBefore, minAfter, maxAfter };
  }

  if (config.method === 'cap') {
    const cleanedRows = rows.map((r) => {
      const num = Number(r[columnName]);
      if (isNaN(num)) return r;
      if (num < bounds.lowerBound) {
        affectedCount++;
        return { ...r, [columnName]: Math.round(bounds.lowerBound * 100) / 100 };
      }
      if (num > bounds.upperBound) {
        affectedCount++;
        return { ...r, [columnName]: Math.round(bounds.upperBound * 100) / 100 };
      }
      return r;
    });

    const numericValsAfter = cleanedRows.map((r) => Number(r[columnName])).filter((n) => !isNaN(n));
    const minAfter = numericValsAfter.length ? Math.min(...numericValsAfter) : 0;
    const maxAfter = numericValsAfter.length ? Math.max(...numericValsAfter) : 0;

    return { cleanedRows, affectedCount, minBefore, maxBefore, minAfter, maxAfter };
  }

  if (config.method === 'log') {
    const cleanedRows = rows.map((r) => {
      const num = Number(r[columnName]);
      if (isNaN(num) || num < 0) return r;
      affectedCount++;
      return { ...r, [columnName]: Math.round(Math.log1p(num) * 10000) / 10000 };
    });

    const numericValsAfter = cleanedRows.map((r) => Number(r[columnName])).filter((n) => !isNaN(n));
    const minAfter = numericValsAfter.length ? Math.min(...numericValsAfter) : 0;
    const maxAfter = numericValsAfter.length ? Math.max(...numericValsAfter) : 0;

    return { cleanedRows, affectedCount, minBefore, maxBefore, minAfter, maxAfter };
  }

  return { cleanedRows: [...rows], affectedCount: 0, minBefore, maxBefore, minAfter: minBefore, maxAfter: maxBefore };
}
