/**
 * Goldset Consensus Builder — takes results from multiple model runs
 * and applies majority voting to produce a refined goldset.
 *
 * This implements Fase 2 ("Curadoria e Consolidação do Oráculo"):
 * predictions that appear in ≥ threshold fraction of models are
 * accepted into the consensus; the rest are filtered as hallucinations.
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Types ────────────────────────────────────────────────────────────

export interface ConsensusOptions {
  /** Directory containing comparison_results_v*.json files. */
  resultsDir: string;

  /** Model version tags to include (e.g. ["llama3-local__standard-ast-ctx"]). */
  versionTags: string[];

  /** Fraction of models that must agree for a smell to be included. Default: 0.5 */
  threshold: number;

  /** Where to write the consensus goldset. */
  outputPath: string;

  /** If true, also write a disagreement report. */
  writeReport: boolean;
}

export interface FileVote {
  file: string;
  /** For each model, which smells it detected. */
  modelVotes: Record<string, string[]>;
  /** Smells that passed the majority threshold. */
  consensusSmells: string[];
  /** Smells where models strongly disagreed. */
  disagreements: string[];
}

// ── Core logic ───────────────────────────────────────────────────────

export function buildConsensus(opts: ConsensusOptions): FileVote[] {
  const { resultsDir, versionTags, threshold, outputPath, writeReport } = opts;

  // 1. Load all result files
  const allResults = new Map<string, Map<string, string[]>>();
  // Map<fileName, Map<modelTag, smells[]>>

  for (const tag of versionTags) {
    const filePath = path.join(resultsDir, `comparison_results_v${tag}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ Results file not found for tag "${tag}": ${filePath}`);
      continue;
    }

    const data: Array<{
      file: string;
      modelSmells?: string[];
      ollamaSmells?: string[];
      modelStatus?: string;
      ollamaStatus?: string;
    }> = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const entry of data) {
      const status = entry.modelStatus ?? entry.ollamaStatus ?? 'unknown';
      if (status !== 'success') continue;

      const smells = (entry.modelSmells ?? entry.ollamaSmells ?? [])
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.toLowerCase() !== 'none');

      if (!allResults.has(entry.file)) {
        allResults.set(entry.file, new Map());
      }
      allResults.get(entry.file)!.set(tag, smells);
    }
  }

  // 2. Majority voting per file
  const modelCount = versionTags.length;
  const minVotes = Math.ceil(modelCount * threshold);
  const votes: FileVote[] = [];

  for (const [file, modelVotes] of allResults) {
    // Count how many models detected each smell
    const smellCounts = new Map<string, number>();
    for (const [, smells] of modelVotes) {
      for (const smell of smells) {
        smellCounts.set(smell, (smellCounts.get(smell) ?? 0) + 1);
      }
    }

    const consensusSmells: string[] = [];
    const disagreements: string[] = [];

    for (const [smell, count] of smellCounts) {
      if (count >= minVotes) {
        consensusSmells.push(smell);
      } else {
        // Detected by some but not enough — disagreement
        disagreements.push(`${smell} (${count}/${modelCount} models)`);
      }
    }

    votes.push({
      file,
      modelVotes: Object.fromEntries(modelVotes),
      consensusSmells,
      disagreements,
    });
  }

  // 3. Write consensus goldset in the same format as run.txt
  const goldsetLines = votes.map((v) => {
    const smells = v.consensusSmells.length > 0
      ? v.consensusSmells.join(', ')
      : 'None';
    return `File Name: ${v.file} - Smells: ${smells}`;
  });

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, goldsetLines.join('\n'));
  console.log(`\n✅ Consensus goldset written to ${outputPath} (${votes.length} files, threshold: ${threshold})`);

  // 4. Write disagreement report if requested
  if (writeReport) {
    const reportPath = outputPath.replace(/\.[^.]+$/, '_disagreements.json');
    const reportData = votes
      .filter((v) => v.disagreements.length > 0)
      .map((v) => ({
        file: v.file,
        consensusSmells: v.consensusSmells,
        disagreements: v.disagreements,
        modelVotes: v.modelVotes,
      }));

    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`📊 Disagreement report written to ${reportPath} (${reportData.length} files with conflicts)`);
  }

  return votes;
}
