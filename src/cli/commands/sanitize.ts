import { Command } from "commander";
import { loadConfig } from "../../config/index.ts";
import { sanitizeComparisonResults } from "../../sanitizer/index.ts";

export const sanitizeCommand = new Command("sanitize")
  .description("Keep only [MATCH] model smell labels in comparison results")
  .option("-c, --config <path>", "Path to config file", "ts-test-smell-bench.config.json")
  .option("-v, --version-suffix <version>", "Version suffix for the input file")
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);
      if (options.versionSuffix) config.analyzer.version = options.versionSuffix;
      sanitizeComparisonResults(config);
    } catch (error) {
      console.error("Error during sanitization:", error);
      process.exit(1);
    }
  });
