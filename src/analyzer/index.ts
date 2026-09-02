import * as fs from "fs";
import * as path from "path";
import type {
  AnalyzerConfig,
  ModelConfig,
  PromptConfig,
} from "../config/index.ts";
import type { ModelProvider } from "./provider.ts";
import { createProvider } from "./providers/index.ts";

function parseReferenceFile(
  filePath: string
): Array<{ file: string; smells: string[] }> {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const results: Array<{ file: string; smells: string[] }> = [];

  for (const line of lines) {
    const match = line.match(/File Name:\s*(.*?)\s*-\s*Smells:\s*(.*)/i);
    if (match) {
      const fileName = match[1].trim();
      const smellsStr = match[2].trim();
      let smells: string[] = [];
      if (smellsStr.toLowerCase() !== "none") {
        smells = smellsStr.split(",").map((s) => s.trim());
      }
      results.push({ file: fileName, smells });
    }
  }

  return results;
}

export interface RunAnalyzerOptions {
  config: AnalyzerConfig;
  provider: ModelProvider;
  systemPrompt: string;
  promptConfig?: PromptConfig;
  onPrompt?: (
    message: string,
    type: "clean" | "next-batch" | "resume"
  ) => Promise<boolean>;
}

interface GoldsetEntry {
  file: string;
  smells: string[];
}

const GOLDSET_BATCH_SIZE = 50;

function formatGoldset(
  entries: GoldsetEntry[],
  providerName: string,
  batchCount: number
): string {
  const lines = [`[LLM="${providerName}"]`];

  for (let index = 0; index < entries.length; index += GOLDSET_BATCH_SIZE) {
    lines.push(`[Batch="${index / GOLDSET_BATCH_SIZE + 1}/${batchCount}"]`);
    for (const entry of entries.slice(index, index + GOLDSET_BATCH_SIZE)) {
      lines.push(
        `File Name: ${entry.file} - Smells: ${
          entry.smells.length > 0 ? entry.smells.join(", ") : "None"
        }`
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

/**
 * Creates the goldset labels in batches.  Unlike runAnalyzer, this function
 * uses the manifest as its input and writes the LLM's labels to run.txt.
 */
export async function generateGoldset({
  config,
  provider,
  systemPrompt,
  promptConfig,
  onPrompt,
}: RunAnalyzerOptions) {
  const manifestPath = path.resolve(process.cwd(), config.manifestPath);
  const testsDir = path.resolve(process.cwd(), config.testsDir);
  const goldsetPath = path.resolve(process.cwd(), config.referenceResultsPath);
  const includeAst = promptConfig?.includeAstMetrics ?? true;
  const includeCtx = promptConfig?.includeContext ?? true;
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const testsToLabel = manifestData.slice(0, config.numTests);
  const totalBatches = Math.ceil(testsToLabel.length / GOLDSET_BATCH_SIZE);

  if (testsToLabel.length === 0) {
    console.log("No tests available to label.");
    return;
  }

  let entries: GoldsetEntry[] = [];
  if (fs.existsSync(goldsetPath)) {
    const existingEntries = parseReferenceFile(goldsetPath);
    const matchesCurrentTests = existingEntries.every(
      (entry, index) => entry.file === testsToLabel[index]?.file
    );
    if (!matchesCurrentTests) {
      const clean = onPrompt
        ? await onPrompt(
            "The existing goldset is for different tests. Delete it and start over?",
            "clean"
          )
        : true;
      if (!clean) throw new Error("Goldset generation cancelled by user.");
    } else {
      const completedBatches = Math.floor(
        existingEntries.length / GOLDSET_BATCH_SIZE
      );

      if (completedBatches > 0) {
        const resume = onPrompt
          ? await onPrompt(
              `Found ${completedBatches} completed goldset batch(es). Resume from batch ${completedBatches + 1}?`,
              "resume"
            )
          : true;

        if (resume) {
          entries = existingEntries.slice(
            0,
            Math.min(
              completedBatches * GOLDSET_BATCH_SIZE,
              testsToLabel.length
            )
          );
        } else {
          const clean = onPrompt
            ? await onPrompt(
                "Delete the existing goldset and start over?",
                "clean"
              )
            : true;
          if (!clean) throw new Error("Goldset generation cancelled by user.");
        }
      } else {
        const clean = onPrompt
          ? await onPrompt(
              "Found an incomplete goldset. Delete it and start over?",
              "clean"
            )
          : true;
        if (!clean) throw new Error("Goldset generation cancelled by user.");
      }
    }
  }

  const completedTests = entries.length;
  if (completedTests >= testsToLabel.length) {
    console.log("Goldset already contains all requested tests.");
    return;
  }

  for (
    let batchStart = completedTests;
    batchStart < testsToLabel.length;
    batchStart += GOLDSET_BATCH_SIZE
  ) {
    const batch = testsToLabel.slice(
      batchStart,
      batchStart + GOLDSET_BATCH_SIZE
    );
    const batchNumber = Math.floor(batchStart / GOLDSET_BATCH_SIZE) + 1;
    console.log(
      `\n=== Generating goldset batch ${batchNumber}/${totalBatches} ===`
    );

    for (const manifestEntry of batch) {
      const testFilePath = path.join(testsDir, manifestEntry.file);
      if (!fs.existsSync(testFilePath)) {
        throw new Error(`Goldset test file not found: ${testFilePath}`);
      }

      const testCode = fs.readFileSync(testFilePath, "utf-8");
      const contextSnippets: string[] = [];
      if (includeCtx) {
        if (manifestEntry.imports?.length > 0) {
          contextSnippets.push(
            `IMPORTS:\n${manifestEntry.imports.join("\n")}`
          );
        }
        if (manifestEntry.describeContext) {
          contextSnippets.push(
            `DESCRIBE BLOCK:\n${manifestEntry.describeContext}`
          );
        }
        if (manifestEntry.setupVariables?.length > 0) {
          contextSnippets.push(
            `SETUP VARIABLES: ${manifestEntry.setupVariables.join(", ")}`
          );
        }
      }

      console.log(`  Labeling ${manifestEntry.file}...`);
      const response = await provider.analyze({
        testCode,
        metadata: includeAst ? manifestEntry.metrics ?? {} : {},
        systemPrompt,
        contextSnippets:
          contextSnippets.length > 0 ? contextSnippets : undefined,
      });
      entries.push({ file: manifestEntry.file, smells: response.smells });
    }

    fs.mkdirSync(path.dirname(goldsetPath), { recursive: true });
    fs.writeFileSync(
      goldsetPath,
      formatGoldset(entries, provider.name, totalBatches)
    );
    console.log(`💾 Goldset batch ${batchNumber} saved to ${goldsetPath}`);

    if (batchStart + GOLDSET_BATCH_SIZE < testsToLabel.length && onPrompt) {
      const proceed = await onPrompt(
        `Goldset batch ${batchNumber} finished. Generate the next batch?`,
        "next-batch"
      );
      if (!proceed) {
        console.log(
          "Goldset generation stopped. You can resume from this batch later."
        );
        return;
      }
    }
  }

  console.log(`\n✅ Goldset generation complete: ${goldsetPath}`);
}

export async function runAnalyzer({
  config,
  provider,
  systemPrompt,
  promptConfig,
  onPrompt,
}: RunAnalyzerOptions) {
  const manifestPath = path.resolve(process.cwd(), config.manifestPath);
  const referencePath = path.resolve(
    process.cwd(),
    config.referenceResultsPath
  );
  const testsDir = path.resolve(process.cwd(), config.testsDir);
  const outputDir = path.resolve(process.cwd(), config.outputDir);

  const includeAst = promptConfig?.includeAstMetrics ?? true;
  const includeCtx = promptConfig?.includeContext ?? true;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const versionSuffix = config.version ? `_v${config.version}` : "";
  const outputPath = path.join(
    outputDir,
    `comparison_results${versionSuffix}.json`
  );

  let comparisonResults: any[] = [];
  let testsCompleted = 0;

  if (fs.existsSync(outputPath)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
      if (Array.isArray(existingData) && existingData.length > 0) {
        testsCompleted = existingData.length;
        const completedBatches = Math.floor(testsCompleted / 50);
        testsCompleted = completedBatches * 50; // Align to batch boundary

        if (completedBatches > 0) {
          let resume = true;
          if (onPrompt) {
            resume = await onPrompt(
              `Found existing results (${
                completedBatches * 50
              } tests completed). Resume from batch ${completedBatches + 1}?`,
              "resume"
            );
          } else {
            resume = true;
          }

          if (resume) {
            comparisonResults = existingData.slice(0, testsCompleted);
          } else {
            let clean = true;
            if (onPrompt) {
              clean = await onPrompt(
                `Clean previous results and start over?`,
                "clean"
              );
            }
            if (!clean) {
              throw new Error("Aborted by user.");
            }
            testsCompleted = 0;
            fs.unlinkSync(outputPath);
          }
        } else {
          // Less than 1 full batch completed. We must clean and start over.
          let clean = true;
          if (onPrompt) {
            clean = await onPrompt(
              "Found incomplete results. Clean them and start over?",
              "clean"
            );
          }
          if (!clean) {
            throw new Error("Aborted by user.");
          }
          fs.unlinkSync(outputPath);
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn("Could not read existing results, starting fresh.", error);
      } else {
        throw error;
      }
    }
  }

  console.log("Loading metadata...");
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const manifestMap = new Map<string, any>();
  for (const item of manifestData) {
    manifestMap.set(item.file, item);
  }

  console.log("Parsing reference results...");
  const referenceResults = parseReferenceFile(referencePath);
  const totalTestsToRun = Math.min(config.numTests, referenceResults.length);
  const testsToRun = referenceResults.slice(testsCompleted, totalTestsToRun);

  if (testsToRun.length === 0) {
    console.log("No more tests to run.");
    return;
  }

  const batchSize = 50;
  const numBatches = Math.ceil(testsToRun.length / batchSize);

  const ablationLabel = `AST=${includeAst ? "ON" : "OFF"}, Context=${
    includeCtx ? "ON" : "OFF"
  }`;
  console.log(
    `Starting analysis with "${provider.name}" for ${testsToRun.length} remaining tests in ${numBatches} batches (${ablationLabel})...`
  );

  let currentIndex = 0;

  for (let batchIdx = 0; batchIdx < numBatches; batchIdx++) {
    const currentBatch = testsToRun.slice(
      currentIndex,
      currentIndex + batchSize
    );
    console.log(`\n=== Starting Batch ${batchIdx + 1} of ${numBatches} ===`);

    for (let i = 0; i < currentBatch.length; i++) {
      const testInfo = currentBatch[i];
      const fileName = testInfo.file;
      const referenceSmells = testInfo.smells;
      const overallIndex = testsCompleted + currentIndex + i + 1;

      console.log(
        `\n[${overallIndex}/${totalTestsToRun}] Processing ${fileName}...`
      );

      const testFilePath = path.join(testsDir, fileName);
      if (!fs.existsSync(testFilePath)) {
        console.warn(`Warning: Test file ${testFilePath} not found. Skipping.`);
        continue;
      }

      const testCode = fs.readFileSync(testFilePath, "utf-8");
      const manifestEntry = manifestMap.get(fileName);

      if (!manifestEntry?.metrics) {
        console.warn(
          `Warning: Metadata for ${fileName} not found. Running without AST metrics.`
        );
      }

      const metadata = includeAst ? manifestEntry?.metrics ?? {} : {};
      const contextSnippets: string[] = [];

      if (includeCtx) {
        if (manifestEntry.imports && manifestEntry.imports.length > 0) {
          contextSnippets.push(`IMPORTS:\n${manifestEntry.imports.join("\n")}`);
        }
        if (manifestEntry.describeContext) {
          contextSnippets.push(
            `DESCRIBE BLOCK:\n${manifestEntry.describeContext}`
          );
        }
        if (
          manifestEntry.setupVariables &&
          manifestEntry.setupVariables.length > 0
        ) {
          contextSnippets.push(
            `SETUP VARIABLES: ${manifestEntry.setupVariables.join(", ")}`
          );
        }
      }

      try {
        const response = await provider.analyze({
          testCode,
          metadata,
          systemPrompt,
          contextSnippets:
            contextSnippets.length > 0 ? contextSnippets : undefined,
        });

        const status =
          response.smells.length > 0 || response.justification
            ? "success"
            : "invalid return";

        const result = {
          file: fileName,
          referenceSmells,
          modelSmells: response.smells,
          modelName: response.modelName,
          modelStatus: status,
          modelJustification: response.justification,
          latencyMs: response.latencyMs,
          rawModelResponse: response.rawText,
          tokenUsage: response.tokenUsage,
        };

        comparisonResults.push(result);

        console.log(
          `  Reference Smells: ${referenceSmells.join(", ") || "None"}`
        );
        if (status === "success") {
          console.log(
            `  Model Smells:     ${response.smells.join(", ") || "None"}`
          );
        } else {
          console.log(`  Model Smells:     [Invalid Format]`);
        }
        console.log(`  Latency:          ${response.latencyMs}ms`);
      } catch (error) {
        console.error(`Error running analysis for ${fileName}:`, error);
        comparisonResults.push({
          file: fileName,
          referenceSmells,
          modelSmells: [],
          modelName: provider.name,
          modelStatus: "error",
          error: String(error),
        });
      }
    }

    // Save intermediate results after each batch
    fs.writeFileSync(outputPath, JSON.stringify(comparisonResults, null, 2));
    console.log(
      `\n💾 Batch ${batchIdx + 1} completed and saved to ${outputPath}`
    );
    currentIndex += batchSize;

    // Ask to continue if there are more batches
    if (batchIdx < numBatches - 1) {
      if (onPrompt) {
        const proceed = await onPrompt(
          `Batch ${batchIdx + 1} finished. Proceed to next batch?`,
          "next-batch"
        );
        if (!proceed) {
          throw new Error("Pipeline stopped by user after batch completion.");
        }
      }
    }
  }

  console.log(`\n✅ Analysis complete. Final results saved to ${outputPath}`);
}

const DEFAULT_SYSTEM_PROMPT = `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.
Your goal is to cross-reference the provided AST JSON metrics with the source code and classify the presence of Test Smells.
Respond only in the following format:
FILE: [NAME] - SMELLS: [LIST] - JUSTIFICATION: [SHORT]`;

export async function runAnalyzerLegacy(analyzerConfig: AnalyzerConfig) {
  const modelConfig: ModelConfig = {
    id: analyzerConfig.model ?? "detector-smells",
    provider: "ollama",
    model: analyzerConfig.model ?? "detector-smells",
    baseUrl: analyzerConfig.ollamaUrl ?? "http://localhost:11434/api/generate",
  };
  const provider = createProvider(modelConfig);
  return runAnalyzer({
    config: analyzerConfig,
    provider,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  });
}
