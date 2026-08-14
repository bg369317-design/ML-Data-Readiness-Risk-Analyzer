export function detectCategoricalVariations(rows: any[], columnName: string): {
  variationsMap: Record<string, string>;
  totalAffected: number;
  uniqueOriginal: number;
  uniqueStandardized: number;
} {
  const valueCounts: Record<string, number> = {};

  rows.forEach((r) => {
    const val = r[columnName];
    if (val !== null && val !== undefined && val !== '') {
      const str = String(val);
      valueCounts[str] = (valueCounts[str] || 0) + 1;
    }
  });

  const uniqueOriginal = Object.keys(valueCounts).length;
  const canonicalGroups: Record<string, { original: string; count: number }[]> = {};

  // Group by trimmed lowercase key
  Object.entries(valueCounts).forEach(([strVal, count]) => {
    const key = strVal.trim().toLowerCase();
    if (!canonicalGroups[key]) {
      canonicalGroups[key] = [];
    }
    canonicalGroups[key].push({ original: strVal, count });
  });

  const variationsMap: Record<string, string> = {};
  let totalAffected = 0;

  Object.values(canonicalGroups).forEach((group) => {
    if (group.length > 0) {
      // Pick the most frequent original variation as canonical form, capitalized cleanly
      group.sort((a, b) => b.count - a.count);
      const topVariation = group[0].original;
      const canonical = topVariation.trim();

      group.forEach((item) => {
        if (item.original !== canonical) {
          variationsMap[item.original] = canonical;
          totalAffected += item.count;
        }
      });
    }
  });

  const uniqueStandardized = new Set(
    Object.keys(valueCounts).map((k) => variationsMap[k] || k.trim())
  ).size;

  return {
    variationsMap,
    totalAffected,
    uniqueOriginal,
    uniqueStandardized,
  };
}

export function standardizeCategorical(
  rows: any[],
  columnName: string
): { cleanedRows: any[]; affectedCount: number; mappingApplied: Record<string, string> } {
  const { variationsMap } = detectCategoricalVariations(rows, columnName);
  let affectedCount = 0;

  const cleanedRows = rows.map((row) => {
    const val = row[columnName];
    if (val !== null && val !== undefined && val !== '') {
      const strVal = String(val);
      const strTrim = strVal.trim();
      const mapped = variationsMap[strVal] || variationsMap[strTrim] || strTrim;
      if (mapped !== strVal) {
        affectedCount++;
        return { ...row, [columnName]: mapped };
      }
    }
    return row;
  });

  return { cleanedRows, affectedCount, mappingApplied: variationsMap };
}
