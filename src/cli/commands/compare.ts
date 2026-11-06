import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../../config/index.ts";
import {
  buildComparisonMatrix,
  generateComparisonHtml,
  type ComparisonMatrix,
} from "../../evaluator/compare.ts";
import { writeCrossModelReport } from "../../evaluator/cross-model.ts";

const TAG_WIDTH = 40;
const COL_WIDTH = 8;
const SMELL_WIDTH = 30;

function printMatrix({ runs, smells, data, averages }: ComparisonMatrix): void {
  const percent = (value: number) => (value * 100).toFixed(1).padStart(COL_WIDTH);
  const header =
    "Smell".padEnd(SMELL_WIDTH) +
    runs.map((r) => r.tag.slice(-TAG_WIDTH).padStart(COL_WIDTH)).join(" | ");
  const divider = "─".repeat(header.length);

  console.log(header);
  console.log(divider);
  for (const smell of smells) {
    const cells = runs.map((r) => percent(data[smell]?.[r.tag] ?? 0));
    console.log(smell.padEnd(SMELL_WIDTH) + cells.join(" | "));
  }
  console.log(divider);
  console.log("AVERAGE".padEnd(SMELL_WIDTH) + runs.map((r) => percent(averages[r.tag])).join(" | "));
}

export const compareCommand = new Command("compare")
  .description("Compare runs: F1 heatmap across setups plus the cross-model report")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option("-f, --filter <modelId>", "Only compare runs for a specific model ID")
  .option("--json", "Also output raw comparison matrix as JSON", false)
  .action(async (options) => {
    const config = await loadConfig(options.config);
    const outputDir = path.resolve(config.analyzer.outputDir);

    const matrix = buildComparisonMatrix(outputDir, options.filter);
    if (matrix.runs.length === 0) throw new Error("No evaluation results found. Run the pipeline first.");

    console.log(`\nFound ${matrix.runs.length} run(s) across ${matrix.smells.length} smell type(s):\n`);
    printMatrix(matrix);

    generateComparisonHtml(matrix, path.join(outputDir, "cross_setup_comparison.html"));
    writeCrossModelReport(config.analyzer, matrix.runs.map((r) => r.tag));
    if (options.json) {
      const jsonPath = path.join(outputDir, "cross_setup_comparison.json");
      fs.writeFileSync(jsonPath, JSON.stringify(matrix, null, 2));
      console.log(`📄 JSON matrix saved to ${jsonPath}`);
    }
  });
