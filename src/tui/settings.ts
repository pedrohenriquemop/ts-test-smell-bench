import * as fs from "node:fs";
import * as path from "node:path";
import type { PipelineStages } from "../pipeline/index.ts";

/** Sanitize always runs, so it is not a toggle in the TUI. */
export type TuiStages = Omit<PipelineStages, "sanitize">;

export interface TuiSettings {
  selectedModelIds: string[];
  stages: TuiStages;
}

const SETTINGS_FILENAME = ".ts-test-smell-bench.tui.json";

const DEFAULT_STAGES: TuiStages = {
  mine: false,
  prepare: false,
  humanEvaluation: false,
  analyze: false,
  mergeGoldset: false,
  evaluate: false,
  generateMetrics: false,
};

const settingsPath = () => path.resolve(SETTINGS_FILENAME);

export function loadTuiSettings(): TuiSettings {
  const defaults: TuiSettings = { selectedModelIds: [], stages: { ...DEFAULT_STAGES } };
  if (!fs.existsSync(settingsPath())) return defaults;

  try {
    const saved = JSON.parse(fs.readFileSync(settingsPath(), "utf8"));
    const savedStages = saved.stages && typeof saved.stages === "object" ? saved.stages : {};
    const stages = { ...DEFAULT_STAGES };
    for (const stage of Object.keys(stages) as Array<keyof TuiStages>) {
      if (typeof savedStages[stage] === "boolean") stages[stage] = savedStages[stage];
    }
    return {
      selectedModelIds: Array.isArray(saved.selectedModelIds)
        ? saved.selectedModelIds.filter((id: unknown): id is string => typeof id === "string")
        : [],
      stages,
    };
  } catch {
    return defaults;
  }
}

export function saveTuiSettings(settings: TuiSettings): void {
  fs.writeFileSync(settingsPath(), `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}
