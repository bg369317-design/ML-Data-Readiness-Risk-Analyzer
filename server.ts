import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { analyzeDataset, parseCSVData } from "./src/analyzer";
import { generateAISummary } from "./src/ai/explanation";
import { AnalysisResults, PredictionType } from "./src/types";
import { DEMO_DATA_ROWS, getDemoCSVString } from "./src/data/demoDataset";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // In-memory analysis storage
  const analysesStore = new Map<string, AnalysisResults>();

  // Initialize with demo dataset analysis pre-loaded
  try {
    const demoRows = DEMO_DATA_ROWS;
    const initialDemoAnalysis = analyzeDataset(
      demoRows,
      "customer_churn_demo.csv",
      "classification",
      "churn",
      "Predict whether a customer will churn"
    );
    // Add default AI summary for demo dataset
    initialDemoAnalysis.aiSummary = {
      plainLanguageSummary: "This dataset is structurally clean and well-formatted for classification, but contains critical ML-specific risk factors that will cause model failure if unaddressed.",
      majorRisksExplanation: "The analysis flagged two high-risk potential data leakage variables ('account_closed_date' and 'exit_survey_score') which are populated exclusively after a customer churns. Additionally, severe target imbalance (91% stayed vs 9% churned) and an identifier column ('customer_id') were detected.",
      whyEachMatters: "Data leakage creates false 99%+ validation accuracy during offline testing, but in production when predicting active customers, those features won't exist. Severe class imbalance will cause standard models to trivially predict 'stayed' for all customers.",
      recommendedNextSteps: [
        "Remove 'account_closed_date' and 'exit_survey_score' from feature matrix prior to training.",
        "Drop 'customer_id' to prevent memorization and overfitting.",
        "Apply class weighting or SMOTE resampling to handle 91:9 class imbalance.",
        "Group 'city' high-cardinality categories using frequency or target encoding."
      ],
      finalReadinessExplanation: "Status is HIGH RISK. Do NOT proceed directly to model training. Resolve data leakage features first to ensure reliable predictions."
    };
    analysesStore.set(initialDemoAnalysis.id, initialDemoAnalysis);
  } catch (err) {
    console.error("Error pre-loading demo dataset analysis:", err);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get Demo Dataset CSV
  app.get("/api/demo-dataset", (req, res) => {
    res.json({
      fileName: "customer_churn_demo.csv",
      csvText: getDemoCSVString(),
      rows: DEMO_DATA_ROWS
    });
  });

  // Start analysis endpoint
  app.post("/api/analysis/start", async (req, res) => {
    try {
      const { csvText, rows, fileName, predictionType, targetColumn, predictionObjective } = req.body;

      let dataToAnalyze: any[] = [];
      if (Array.isArray(rows) && rows.length > 0) {
        dataToAnalyze = rows;
      } else if (typeof csvText === 'string' && csvText.trim().length > 0) {
        dataToAnalyze = parseCSVData(csvText);
      } else {
        return res.status(400).json({ error: "Missing dataset content (csvText or rows required)." });
      }

      if (dataToAnalyze.length === 0) {
        return res.status(400).json({ error: "Dataset contains 0 valid rows." });
      }

      const selectedPredictionType: PredictionType = predictionType || 'classification';
      const selectedTarget = targetColumn || Object.keys(dataToAnalyze[0])[0];

      const results = analyzeDataset(
        dataToAnalyze,
        fileName || "uploaded_dataset.csv",
        selectedPredictionType,
        selectedTarget,
        predictionObjective || ""
      );

      // Generate AI summary
      const aiSummary = await generateAISummary(results);
      results.aiSummary = aiSummary;

      analysesStore.set(results.id, results);

      res.json(results);
    } catch (err: any) {
      console.error("Analysis execution failed:", err);
      res.status(500).json({ error: err.message || "Analysis failed." });
    }
  });

  // Get specific analysis by ID
  app.get("/api/analysis/:id", (req, res) => {
    const analysis = analysesStore.get(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found." });
    }
    res.json(analysis);
  });

  // Re-generate AI summary
  app.post("/api/analysis/:id/ai-summary", async (req, res) => {
    const analysis = analysesStore.get(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found." });
    }

    try {
      const aiSummary = await generateAISummary(analysis);
      analysis.aiSummary = aiSummary;
      analysesStore.set(analysis.id, analysis);
      res.json(aiSummary);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "AI summary generation failed." });
    }
  });

  // History endpoint
  app.get("/api/history", (req, res) => {
    const list = Array.from(analysesStore.values()).map(a => ({
      id: a.id,
      createdAt: a.createdAt,
      datasetName: a.datasetName,
      predictionType: a.predictionType,
      targetColumn: a.targetColumn,
      overallScore: a.overallScore,
      overallStatus: a.overallStatus,
      rowCount: a.profile.rowCount,
      columnCount: a.profile.columnCount,
      riskCount: a.risks.length
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(list);
  });

  // Delete analysis from history
  app.delete("/api/history/:id", (req, res) => {
    const deleted = analysesStore.delete(req.params.id);
    res.json({ success: deleted });
  });

  // Serve Vite in dev, static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ML Data-Readiness Analyzer running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
