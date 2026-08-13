import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResults } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateAISummary(analysis: AnalysisResults) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return getFallbackSummary(analysis);
  }

  const promptPayload = {
    datasetName: analysis.datasetName,
    predictionType: analysis.predictionType,
    targetColumn: analysis.targetColumn,
    predictionObjective: analysis.predictionObjective,
    overallScore: analysis.overallScore,
    overallStatus: analysis.overallStatus,
    scores: analysis.scores,
    rowCount: analysis.profile.rowCount,
    columnCount: analysis.profile.columnCount,
    leakageCount: analysis.leakageFindings.length,
    leakageFeatures: analysis.leakageFindings.map((f) => f.featureName),
    targetImbalance: analysis.targetAnalysis.isImbalanced
      ? `${analysis.targetAnalysis.majorityPercentage}% majority vs ${analysis.targetAnalysis.minorityPercentage}% minority`
      : "Balanced",
    criticalRisks: analysis.risks.slice(0, 5).map((r) => ({
      title: r.title,
      evidence: r.evidence,
      whyItMatters: r.whyItMatters,
    })),
  };

  const prompt = `You are a Senior Machine Learning Engineer and Data Science Auditor. Analyze the following structured ML Data-Readiness assessment summary for dataset '${analysis.datasetName}':
${JSON.stringify(promptPayload, null, 2)}

Generate a clear, professional, plain-language assessment explanation.
Follow these rules strictly:
1. Explain why 'clean data does not automatically mean good ML data'.
2. Be direct, authoritative, and helpful to a data practitioner or business stakeholder.
3. Address the specific risks detected in this assessment (e.g., leakage, imbalance, cardinality).`;

  const modelsToTry = ["gemini-2.0-flash", "gemini-3.6-flash", "gemini-3.7-flash"];

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  plainLanguageSummary: {
                    type: Type.STRING,
                    description:
                      "A high-level plain-language summary of the dataset suitability for the intended ML task.",
                  },
                  majorRisksExplanation: {
                    type: Type.STRING,
                    description:
                      "Clear explanation of detected ML-specific risks (leakage, target imbalance, IDs, cardinality).",
                  },
                  whyEachMatters: {
                    type: Type.STRING,
                    description:
                      "Why these specific findings matter for model performance, evaluation, and production deployment.",
                  },
                  recommendedNextSteps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description:
                      "Actionable, step-by-step next steps for the user before training.",
                  },
                  finalReadinessExplanation: {
                    type: Type.STRING,
                    description:
                      "Final verdict on whether the dataset is safe to proceed to model training.",
                  },
                },
                required: [
                  "plainLanguageSummary",
                  "majorRisksExplanation",
                  "whyEachMatters",
                  "recommendedNextSteps",
                  "finalReadinessExplanation",
                ],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            return parsed;
          }
        } catch (error: any) {
          const isTransient =
            error?.status === "UNAVAILABLE" ||
            error?.code === 503 ||
            error?.status === 503 ||
            error?.message?.includes("503") ||
            error?.message?.includes("high demand") ||
            error?.message?.includes("RESOURCE_EXHAUSTED");

          if (isTransient && attempts < maxAttempts) {
            await delay(attempts * 500);
            continue;
          }
          break; // Try next fallback model silently
        }
      }
    }
  } catch (_err) {
    // Fall back smoothly to deterministic heuristic summary
  }

  return getFallbackSummary(analysis);
}

function getFallbackSummary(analysis: AnalysisResults) {
  const leakageNames = analysis.leakageFindings.map((l) => l.featureName).join(", ");
  return {
    plainLanguageSummary: `This dataset '${analysis.datasetName}' contains ${analysis.profile.rowCount.toLocaleString()} records across ${analysis.profile.columnCount} features for predicting '${analysis.targetColumn}' (${analysis.predictionType}). Overall ML Readiness score is ${analysis.overallScore}/100.`,
    majorRisksExplanation:
      analysis.risks.length > 0
        ? `Detected ${analysis.risks.length} key ML risk signals${leakageNames ? `, including potential data leakage variables (${leakageNames})` : ""}${analysis.targetAnalysis.isImbalanced ? " and target class imbalance" : ""}.`
        : `No critical data leakage or severe quality blockers detected.`,
    whyEachMatters:
      "Unmitigated data leakage will cause models to produce artificially high offline validation accuracy but fail completely in production, while unaddressed target imbalance skews predictive thresholding.",
    recommendedNextSteps:
      analysis.recommendations.length > 0
        ? analysis.recommendations.slice(0, 4).map((r) => r.recommendedAction)
        : [
            "Drop or isolate suspected leakage features prior to model splitting.",
            "Apply resampling (e.g. SMOTE) or class weights for target imbalance.",
            "Filter constant and identifier columns before feature encoding.",
          ],
    finalReadinessExplanation: `Dataset is categorized as '${analysis.overallStatus}'. Review high-priority audit findings before initiating model training pipelines.`,
  };
}

