import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../../config/index.ts";
import { buildConsensus } from "../../consensus/index.ts";

const RESULTS_FILE = /^comparison_results_v(.+)\.json$/;

export const consensusCommand = new Command("consensus")
  .description("Build a consensus goldset from multiple model runs using majority voting")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option(
    "--tags <tags...>",
    "Run tags to include (e.g. llama3.1-8b__chain-of-thought-ast-ctx). Defaults to every run found.",
  )
  .option("-t, --threshold <number>", "Fraction of runs that must agree (0.0 - 1.0)", "0.5")
  .option("-o, --output <path>", "Output path for consensus goldset", "goldset/consensus.txt")
  .option("--report", "Also generate a disagreement report JSON", false)
  .action(async (options) => {
    const config = await loadConfig(options.config);
    const outputDir = path.resolve(config.analyzer.outputDir);

    let tags: string[] = options.tags ?? [];
    if (tags.length === 0) {
      tags = fs.readdirSync(outputDir).flatMap((f) => f.match(RESULTS_FILE)?.[1] ?? []);
      if (tags.length === 0) throw new Error("No comparison results found. Run the analyze stage first.");
      console.log(`Auto-discovered ${tags.length} result sets: ${tags.join(", ")}`);
    }

    buildConsensus({
      resultsDir: outputDir,
      versionTags: tags,
      threshold: parseFloat(options.threshold),
      outputPath: path.resolve(options.output),
      writeReport: options.report,
    });
  });
