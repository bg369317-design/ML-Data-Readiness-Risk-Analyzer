export interface DuplicateCheckResult {
  duplicateCount: number;
  duplicatePercentage: number;
  uniqueRowsCount: number;
}

export function checkDuplicates(rows: any[]): DuplicateCheckResult {
  if (!rows || rows.length === 0) {
    return { duplicateCount: 0, duplicatePercentage: 0, uniqueRowsCount: 0 };
  }

  const seen = new Set<string>();
  let duplicateCount = 0;

  rows.forEach((row) => {
    const rowKey = JSON.stringify(row);
    if (seen.has(rowKey)) {
      duplicateCount++;
    } else {
      seen.add(rowKey);
    }
  });

  const duplicatePercentage = Number(((duplicateCount / rows.length) * 100).toFixed(2));
  const uniqueRowsCount = rows.length - duplicateCount;

  return { duplicateCount, duplicatePercentage, uniqueRowsCount };
}

export function removeDuplicates(rows: any[]): { cleanedRows: any[]; removedCount: number } {
  if (!rows || rows.length === 0) return { cleanedRows: [], removedCount: 0 };

  const seen = new Set<string>();
  const cleanedRows: any[] = [];
  let removedCount = 0;

  rows.forEach((row) => {
    const rowKey = JSON.stringify(row);
    if (seen.has(rowKey)) {
      removedCount++;
    } else {
      seen.add(rowKey);
      cleanedRows.push(row);
    }
  });

  return { cleanedRows, removedCount };
}
