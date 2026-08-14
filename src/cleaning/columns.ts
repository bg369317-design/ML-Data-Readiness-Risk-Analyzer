export function toSnakeCase(str: string): string {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s\-\.]+/g, '_')
    .toLowerCase();
}

export function standardizeColumnNames(
  rows: any[],
  targetColumn: string
): { cleanedRows: any[]; renameMap: Record<string, string>; newTargetColumn: string } {
  if (!rows || rows.length === 0) {
    return { cleanedRows: [], renameMap: {}, newTargetColumn: targetColumn };
  }

  const oldHeaders = Object.keys(rows[0] || {});
  const renameMap: Record<string, string> = {};

  oldHeaders.forEach((oldH) => {
    const newH = toSnakeCase(oldH);
    renameMap[oldH] = newH;
  });

  const newTargetColumn = renameMap[targetColumn] || targetColumn;

  const cleanedRows = rows.map((row) => {
    const newRow: Record<string, any> = {};
    Object.entries(row).forEach(([k, v]) => {
      const newKey = renameMap[k] || k;
      newRow[newKey] = v;
    });
    return newRow;
  });

  return { cleanedRows, renameMap, newTargetColumn };
}
