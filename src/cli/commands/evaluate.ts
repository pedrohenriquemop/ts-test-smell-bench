import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../../config/index.ts";
import { evaluateResults } from "../../evaluator/index.ts";

export const evaluateCommand = new Command("evaluate")
  .description("Score comparison results and generate the metrics JSON, HTML report and charts")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option("-v, --version-suffix <version>", "Version suffix for the input/output files")
  .action(async (options) => {
    const config = await loadConfig(options.config);
    if (options.versionSuffix) config.analyzer.version = options.versionSuffix;
    await evaluateResults(config.analyzer);
  });
