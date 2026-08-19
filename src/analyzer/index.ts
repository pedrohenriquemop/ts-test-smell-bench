import * as fs from 'fs';
import * as path from 'path';
import type { AnalyzerConfig, ModelConfig } from '../config/index.ts';
import type { ModelProvider } from './provider.ts';
import { createProvider } from './providers/index.ts';

// ── Reference-result parser (formerly "Gemini parser") ───────────────

function parseReferenceFile(filePath: string): Array<{ file: string; smells: string[] }> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const results: Array<{ file: string; smells: string[] }> = [];

  for (const line of lines) {
    // Expected format: File Name: <filename> - Smells: <smells>
    const match = line.match(/File Name:\s*(.*?)\s*-\s*Smells:\s*(.*)/i);
    if (match) {
      const fileName = match[1].trim();
      const smellsStr = match[2].trim();
      let smells: string[] = [];
      if (smellsStr.toLowerCase() !== 'none') {
        smells = smellsStr.split(',').map((s) => s.trim());
      }
      results.push({ file: fileName, smells });
    }
  }

  return results;
}

// ── Core analyzer ────────────────────────────────────────────────────

export interface RunAnalyzerOptions {
  config: AnalyzerConfig;
  provider: ModelProvider;
  systemPrompt: string;
}

export async function runAnalyzer({ config, provider, systemPrompt }: RunAnalyzerOptions) {
  const manifestPath = path.resolve(process.cwd(), config.manifestPath);
  const referencePath = path.resolve(process.cwd(), config.referenceResultsPath);
  const testsDir = path.resolve(process.cwd(), config.testsDir);

  console.log('Loading metadata...');
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const metricsMap = new Map<string, Record<string, unknown>>();
  for (const item of manifestData) {
    metricsMap.set(item.file, item.metrics);
  }

  console.log('Parsing reference results...');
  const referenceResults = parseReferenceFile(referencePath);
  const testsToRun = referenceResults.slice(0, config.numTests);

  const comparisonResults: unknown[] = [];

  console.log(`Starting analysis with "${provider.name}" for ${testsToRun.length} tests...`);

  for (let i = 0; i < testsToRun.length; i++) {
    const testInfo = testsToRun[i];
    const fileName = testInfo.file;
    const referenceSmells = testInfo.smells;

    console.log(`\n[${i + 1}/${testsToRun.length}] Processing ${fileName}...`);

    const testFilePath = path.join(testsDir, fileName);
    if (!fs.existsSync(testFilePath)) {
      console.warn(`Warning: Test file ${testFilePath} not found. Skipping.`);
      continue;
    }

    const testCode = fs.readFileSync(testFilePath, 'utf-8');
    const metadata = metricsMap.get(fileName);

    if (!metadata) {
      console.warn(`Warning: Metadata for ${fileName} not found. Skipping.`);
      continue;
    }

    try {
      const response = await provider.analyze({
        testCode,
        metadata,
        systemPrompt,
      });

      const status = response.smells.length > 0 || response.justification ? 'success' : 'invalid return';

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

      console.log(`  Reference Smells: ${referenceSmells.join(', ') || 'None'}`);
      if (status === 'success') {
        console.log(`  Model Smells:     ${response.smells.join(', ') || 'None'}`);
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
        modelStatus: 'error',
        error: String(error),
      });
    }
  }

  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const versionSuffix = config.version ? `_v${config.version}` : '';
  const outputPath = path.join(
    process.cwd(),
    config.outputDir,
    `comparison_results${versionSuffix}.json`,
  );
  fs.writeFileSync(outputPath, JSON.stringify(comparisonResults, null, 2));
  console.log(`\nAnalysis complete. Results saved to ${outputPath}`);
}

// ── Legacy convenience wrapper ───────────────────────────────────────
// Keeps backward compatibility with the old call-site signature:
//   runAnalyzer(analyzerConfig)
// by auto-creating an OllamaProvider from the deprecated fields.

const DEFAULT_SYSTEM_PROMPT = `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.
Your goal is to cross-reference the provided AST JSON metrics with the source code and classify the presence of Test Smells.
Respond only in the following format:
FILE: [NAME] - SMELLS: [LIST] - JUSTIFICATION: [SHORT]`;

export async function runAnalyzerLegacy(analyzerConfig: AnalyzerConfig) {
  const modelConfig: ModelConfig = {
    id: analyzerConfig.model ?? 'detector-smells',
    provider: 'ollama',
    model: analyzerConfig.model ?? 'detector-smells',
    baseUrl: analyzerConfig.ollamaUrl ?? 'http://localhost:11434/api/generate',
  };

  const provider = createProvider(modelConfig);

  return runAnalyzer({
    config: analyzerConfig,
    provider,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  });
}