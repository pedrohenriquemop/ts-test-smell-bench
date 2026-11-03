import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../../config/index.ts";
import { sanitizeComparisonResults } from "../../sanitizer/index.ts";

export const sanitizeCommand = new Command("sanitize")
  .description("Keep only [MATCH] model smell labels in comparison results")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option("-v, --version-suffix <version>", "Version suffix for the input file")
  .action(async (options) => {
    const config = await loadConfig(options.config);
    if (options.versionSuffix) config.analyzer.version = options.versionSuffix;
    sanitizeComparisonResults(config.analyzer);
  });
