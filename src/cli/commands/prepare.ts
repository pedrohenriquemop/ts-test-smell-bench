import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../../config/index.ts";
import { prepareLlmLabelingDataset } from "../../dataset/index.ts";

export const prepareCommand = new Command("prepare")
  .description("Split the mined tests into batches for LLM labelling")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .option("--sample-size <number>", "Override batch size")
  .option("--output <dir>", "Override output directory")
  .option("--manifest <path>", "Override manifest path")
  .action(async (options) => {
    const config = await loadConfig(options.config);
    const dataset = config.dataset;
    if (options.sampleSize) dataset.sampleSize = parseInt(options.sampleSize, 10);
    if (options.output) dataset.outputDir = options.output;
    if (options.manifest) dataset.manifestPath = options.manifest;
    prepareLlmLabelingDataset(dataset, config.miner.outputDir || "tests");
  });
