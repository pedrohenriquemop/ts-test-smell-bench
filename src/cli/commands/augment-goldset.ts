import { Command } from "commander";
import { mergeGoldsetAdditions } from "../../goldset-consensus/index.ts";

export const augmentGoldsetCommand = new Command("augment-goldset")
  .description("Add supplemental smell labels to an existing goldset")
  .option("--base <path>", "Existing goldset", "goldset/run.txt")
  .option(
    "--additions <path>",
    "Supplemental run containing additional smell labels",
    "goldset/run_new_smells.txt",
  )
  .option(
    "-o, --output <path>",
    "Output path for the augmented goldset",
    "goldset/run_augmented.txt",
  )
  .action((options) => {
    try {
      mergeGoldsetAdditions(
        process.cwd(),
        options.base,
        options.additions,
        options.output,
      );
    } catch (error) {
      console.error("Error augmenting goldset:", error);
      process.exit(1);
    }
  });
