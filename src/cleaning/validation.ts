import { ValidationCheckResult } from '../types';

export function validatePreparedDataset(
  rows: any[],
  targetColumn: string
): { isValid: boolean; checks: ValidationCheckResult[] } {
  const checks: ValidationCheckResult[] = [];

  // Check 1: Non-empty dataset
  if (!rows || rows.length === 0) {
    checks.push({
      passed: false,
      checkName: 'Dataset Length',
      message: 'Dataset contains 0 rows after cleaning.',
      severity: 'error',
    });
    return { isValid: false, checks };
  }

  checks.push({
    passed: true,
    checkName: 'Dataset Length',
    message: `Dataset contains ${rows.length.toLocaleString()} valid rows.`,
    severity: 'info',
  });

  // Check 2: Target column exists
  const headers = Object.keys(rows[0] || {});
  if (!headers.includes(targetColumn)) {
    checks.push({
      passed: false,
      checkName: 'Target Preserved',
      message: `Target column '${targetColumn}' was not found in the prepared dataset.`,
      severity: 'error',
    });
    return { isValid: false, checks };
  }

  checks.push({
    passed: true,
    checkName: 'Target Preserved',
    message: `Target column '${targetColumn}' is present and intact.`,
    severity: 'info',
  });

  // Check 3: Check missing target values
  const missingTargetCount = rows.filter((r) => {
    const v = r[targetColumn];
    return v === null || v === undefined || v === '' || v === 'null' || v === 'NaN';
  }).length;

  if (missingTargetCount > 0) {
    checks.push({
      passed: false,
      checkName: 'Target Completeness',
      message: `Target column contains ${missingTargetCount} missing values. Target missingness should be 0%.`,
      severity: 'warning',
    });
  } else {
    checks.push({
      passed: true,
      checkName: 'Target Completeness',
      message: 'Target column is 100% complete without missing values.',
      severity: 'info',
    });
  }

  // Check 4: Column count
  if (headers.length < 2) {
    checks.push({
      passed: false,
      checkName: 'Feature Count',
      message: 'Dataset must have at least 2 columns (1 target + 1 feature).',
      severity: 'error',
    });
  } else {
    checks.push({
      passed: true,
      checkName: 'Feature Count',
      message: `Dataset has ${headers.length - 1} feature columns + 1 target.`,
      severity: 'info',
    });
  }

  const isValid = !checks.some((c) => c.severity === 'error');
  return { isValid, checks };
}
