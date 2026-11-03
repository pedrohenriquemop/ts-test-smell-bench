import * as fs from "fs";
import * as path from "path";
import type { DatasetConfig } from "../config/index.ts";

const BREAKLINE = `\n${"=".repeat(50)}\n`;

function isPreparedFile(file: string): boolean {
  return (
    (file.startsWith("sampled_manifesto_") && file.endsWith(".json")) ||
    (file.startsWith("aggregated_tests_") && file.endsWith(".txt"))
  );
}

/**
 * Splits the manifest into fixed-size batches for manual LLM labelling.
 * Each batch produces sampled_manifesto_{i}.json (metadata) and
 * aggregated_tests_{i}.txt (the test sources, concatenated).
 */
export function prepareLlmLabelingDataset(
  config: DatasetConfig,
  testsFolder = "tests",
): void {
  const { sampleSize, manifestPath, outputDir } = config;
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) {
    throw new Error("sampleSize must be a positive integer.");
  }

  const manifest: Array<{ file: string }> = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  if (manifest.length === 0) {
    console.warn("Manifest is empty; no files generated.");
    return;
  }

  if (fs.existsSync(outputDir)) {
    console.log(`Clearing existing prepared files in ${outputDir}...`);
    for (const file of fs.readdirSync(outputDir).filter(isPreparedFile)) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const batchCount = Math.ceil(manifest.length / sampleSize);
  for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
    const entries = manifest.slice(batchIndex * sampleSize, (batchIndex + 1) * sampleSize);

    let aggregated = `[batch_index: ${batchIndex} | batch ${batchIndex + 1} of ${batchCount} | entries in this file: ${entries.length}]\n`;
    aggregated += BREAKLINE;
    entries.forEach((entry, index) => {
      const filePath = path.join(testsFolder, entry.file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${entry.file}`);
        return;
      }
      aggregated += `[Test ${index + 1}: ${entry.file}]\n`;
      aggregated += fs.readFileSync(filePath, "utf-8");
      aggregated += BREAKLINE;
    });

    const manifestOut = path.join(outputDir, `sampled_manifesto_${batchIndex}.json`);
    const testsOut = path.join(outputDir, `aggregated_tests_${batchIndex}.txt`);
    fs.writeFileSync(
      manifestOut,
      JSON.stringify(
        { batch_index: batchIndex, batch_count: batchCount, sample_size: sampleSize, entries },
        null,
        2,
      ),
    );
    fs.writeFileSync(testsOut, aggregated);
    console.log(`✅ Batch ${batchIndex}: ${manifestOut}, ${testsOut}`);
  }

  console.log(`- Total batches: ${batchCount} (${batchCount * 2} files)`);
  console.log(`- Entries in manifest: ${manifest.length}`);
}
