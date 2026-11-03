import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../../config/index.ts";
import { Miner } from "../../miner/index.ts";

export const mineCommand = new Command("mine")
  .description("Mine TypeScript tests from GitHub repositories")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option("--output <dir>", "Override output directory")
  .action(async (options) => {
    const config = await loadConfig(options.config);
    if (options.output) config.miner.outputDir = options.output;
    await new Miner(config.miner).run();
  });
