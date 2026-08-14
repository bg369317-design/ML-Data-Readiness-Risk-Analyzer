export type PredictionType = 'classification' | 'regression' | 'clustering';

export type RiskSeverity = 'high' | 'medium' | 'low';

export interface ColumnProfile {
  name: string;
  type: 'numeric' | 'categorical' | 'text' | 'datetime' | 'boolean';
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  uniquePercentage: number;
  sampleValues: any[];
  isIdentifier: boolean;
  isConstant: boolean;
  isHighCardinality: boolean;
  skewness?: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
}

export interface DatasetProfile {
  fileName: string;
  fileSizeFormatted: string;
  rowCount: number;
  columnCount: number;
  numericCount: number;
  categoricalCount: number;
  textCount: number;
  datetimeCount: number;
  totalMissingCells: number;
  totalMissingPercentage: number;
  duplicateRowCount: number;
  duplicateRowPercentage: number;
  memoryUsageFormatted: string;
  columns: ColumnProfile[];
}

export interface LeakageFinding {
  featureName: string;
  targetName: string;
  reason: string;
  evidence: string;
  severity: RiskSeverity;
  recommendation: string;
  coOccurrenceRate?: number;
  temporalRisk: boolean;
}

export interface TargetAnalysisResult {
  targetColumn: string;
  predictionType: PredictionType;
  objective?: string;
  missingCount: number;
  missingPercentage: number;
  // Classification
  classDistribution?: Record<string, number>;
  classPercentages?: Record<string, number>;
  majorityClass?: string;
  majorityPercentage?: number;
  minorityClass?: string;
  minorityPercentage?: number;
  imbalanceRatio?: number;
  isImbalanced?: boolean;
  numClasses?: number;
  // Regression
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  skewness?: number;
  isSkewed?: boolean;
  zeroCount?: number;
}

export interface OutlierFinding {
  featureName: string;
  outlierCount: number;
  outlierPercentage: number;
  minVal: number;
  medianVal: number;
  maxVal: number;
  severity: RiskSeverity;
  recommendation: string;
}

export interface FeatureAssociation {
  featureName: string;
  associationScore: number; // 0 to 1
  associationLabel: 'Strong' | 'Moderate' | 'Weak' | 'Suspiciously High';
  isSuspicious: boolean;
}

export interface RiskItem {
  id: string;
  title: string;
  feature?: string;
  severity: RiskSeverity;
  category: 'leakage' | 'target' | 'quality' | 'cardinality' | 'identifier' | 'outlier' | 'constant';
  evidence: string;
  whyItMatters: string;
  recommendedAction: string;
}

export interface RecommendationItem {
  id: string;
  priority: 1 | 2 | 3 | 4;
  priorityLabel: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  feature?: string;
  whatWasDetected: string;
  whyItMatters: string;
  recommendedAction: string;
}

export interface ReadinessSubScores {
  completeness: number; // Data completeness
  consistency: number;   // Data consistency
  targetQuality: number; // Target quality
  featureQuality: number;// Feature quality
  leakageRisk: number;   // Leakage safety (higher is safer)
  mlSafety: number;      // ML Safety index
}

export interface CleaningLogEntry {
  id: string;
  timestamp: string;
  operation: string;
  feature?: string;
  method: string;
  affectedCount: number;
  details: string;
}

export interface DatasetVersion {
  versionNumber: number;
  label: string;
  timestamp: string;
  rowCount: number;
  columnCount: number;
  readinessScore: number;
  operationsApplied: string[];
}

export interface MissingTreatmentConfig {
  method: 'median' | 'mean' | 'mode' | 'constant' | 'remove' | 'keep';
  customValue?: string | number;
}

export interface OutlierTreatmentConfig {
  method: 'keep' | 'remove' | 'cap' | 'log';
}

export interface CleaningConfig {
  removeDuplicates: boolean;
  standardizeColumnNames: boolean;
  missingValueTreatments: Record<string, MissingTreatmentConfig>;
  typeConversions: Record<string, 'numeric' | 'categorical' | 'text' | 'datetime' | 'boolean'>;
  categoryStandardizations: Record<string, boolean>;
  excludedFeatures: string[];
  outlierTreatments: Record<string, OutlierTreatmentConfig>;
  logicalRules: {
    column: string;
    operator: '<' | '>' | '<=' | '>=' | '==' | '!=';
    value: number;
    action: 'remove' | 'keep';
  }[];
}

export interface ValidationCheckResult {
  passed: boolean;
  checkName: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface BeforeAfterMetrics {
  originalScore: number;
  preparedScore: number;
  scoreImprovement: number;
  originalStatus: 'Ready' | 'Needs Review' | 'High Risk';
  preparedStatus: 'Ready' | 'Needs Review' | 'High Risk';
  originalRows: number;
  preparedRows: number;
  rowsRemoved: number;
  originalMissingPercentage: number;
  preparedMissingPercentage: number;
  originalDuplicates: number;
  preparedDuplicates: number;
  resolvedRiskIds: string[];
  remainingRiskIds: string[];
}

export interface AnalysisResults {
  id: string;
  createdAt: string;
  datasetName: string;
  predictionType: PredictionType;
  targetColumn: string;
  predictionObjective: string;
  profile: DatasetProfile;
  targetAnalysis: TargetAnalysisResult;
  leakageFindings: LeakageFinding[];
  outlierFindings: OutlierFinding[];
  featureAssociations: FeatureAssociation[];
  risks: RiskItem[];
  recommendations: RecommendationItem[];
  scores: ReadinessSubScores;
  overallScore: number;
  overallStatus: 'Ready' | 'Needs Review' | 'High Risk';
  // Smart Data Preparation extensions
  rawRows?: any[];
  preparedRows?: any[];
  csvText?: string;
  excludedFeatures?: string[];
  cleaningLogs?: CleaningLogEntry[];
  versions?: DatasetVersion[];
  beforeAfterMetrics?: BeforeAfterMetrics;
  cleaningConfig?: CleaningConfig;
  aiSummary?: {
    plainLanguageSummary: string;
    majorRisksExplanation: string;
    whyEachMatters: string;
    recommendedNextSteps: string[];
    finalReadinessExplanation: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  organization: string;
  accountType?: 'user' | 'admin';
  isAdmin?: boolean;
}
