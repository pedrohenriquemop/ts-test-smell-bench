import React from "react";
import { render } from "ink";
import { Command } from "commander";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../../config/index.ts";
import { App } from "../../tui/app.tsx";

export const tuiCommand = new Command("tui")
  .description("Launch the interactive Terminal UI (TUI) for the benchmark pipeline")
  .option("-c, --config <path>", "Path to config file", DEFAULT_CONFIG_PATH)
  .action(async (options) => {
    const config = await loadConfig(options.config);
    const { waitUntilExit, unmount } = render(<App config={config} onExit={() => unmount()} />);
    await waitUntilExit();
  });
