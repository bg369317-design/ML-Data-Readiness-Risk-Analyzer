import { ColumnProfile } from '../types';

export function analyzeTypeMismatch(rows: any[], columnName: string, currentType: ColumnProfile['type']): {
  suggestedType?: ColumnProfile['type'];
  convertibleCount: number;
  invalidCount: number;
  totalCount: number;
  invalidSamples: string[];
} {
  const rawValues = rows.map((r) => r[columnName]);
  const nonNull = rawValues.filter((v) => v !== null && v !== undefined && v !== '' && v !== 'null' && v !== 'NaN');
  const totalCount = nonNull.length;

  if (totalCount === 0) {
    return { convertibleCount: 0, invalidCount: 0, totalCount: 0, invalidSamples: [] };
  }

  let numericCount = 0;
  let dateCount = 0;
  let boolCount = 0;
  const invalidSamples: string[] = [];

  nonNull.forEach((v) => {
    const s = String(v).trim();
    if (!isNaN(Number(s))) {
      numericCount++;
    } else if (s.toLowerCase() === 'true' || s.toLowerCase() === 'false') {
      boolCount++;
    } else if (!isNaN(Date.parse(s)) && (s.includes('-') || s.includes('/'))) {
      dateCount++;
    } else {
      if (invalidSamples.length < 5) invalidSamples.push(s);
    }
  });

  let suggestedType: ColumnProfile['type'] | undefined;
  let convertibleCount = 0;
  let invalidCount = 0;

  if (currentType === 'text' || currentType === 'categorical') {
    if (numericCount / totalCount >= 0.8) {
      suggestedType = 'numeric';
      convertibleCount = numericCount;
      invalidCount = totalCount - numericCount;
    } else if (dateCount / totalCount >= 0.7) {
      suggestedType = 'datetime';
      convertibleCount = dateCount;
      invalidCount = totalCount - dateCount;
    } else if (boolCount / totalCount >= 0.8) {
      suggestedType = 'boolean';
      convertibleCount = boolCount;
      invalidCount = totalCount - boolCount;
    }
  }

  return {
    suggestedType,
    convertibleCount,
    invalidCount,
    totalCount,
    invalidSamples,
  };
}

export function convertColumnType(
  rows: any[],
  columnName: string,
  targetType: ColumnProfile['type']
): { cleanedRows: any[]; convertedCount: number; invalidCount: number } {
  let convertedCount = 0;
  let invalidCount = 0;

  const cleanedRows = rows.map((row) => {
    const val = row[columnName];
    if (val === null || val === undefined || val === '') {
      return row;
    }

    const strVal = String(val).trim();

    if (targetType === 'numeric') {
      const num = Number(strVal);
      if (!isNaN(num)) {
        convertedCount++;
        return { ...row, [columnName]: num };
      } else {
        invalidCount++;
        return { ...row, [columnName]: null };
      }
    } else if (targetType === 'boolean') {
      if (strVal.toLowerCase() === 'true' || strVal === '1') {
        convertedCount++;
        return { ...row, [columnName]: true };
      } else if (strVal.toLowerCase() === 'false' || strVal === '0') {
        convertedCount++;
        return { ...row, [columnName]: false };
      } else {
        invalidCount++;
        return { ...row, [columnName]: null };
      }
    } else if (targetType === 'categorical' || targetType === 'text') {
      convertedCount++;
      return { ...row, [columnName]: strVal };
    }

    return row;
  });

  return { cleanedRows, convertedCount, invalidCount };
}
