import * as fs from "node:fs";
import * as path from "node:path";

export interface TuiSettings {
  selectedModelIds: string[];
  stages: {
    mine: boolean;
    prepare: boolean;
    analyze: boolean;
    evaluate: boolean;
    mergeGoldset: boolean;
    humanEvaluation: boolean;
  };
}

export const TUI_SETTINGS_FILENAME = ".ts-test-smell-bench.tui.json";

const defaultSettings = (): TuiSettings => ({
  selectedModelIds: [],
  stages: {
    mine: false,
    prepare: false,
    analyze: false,
    evaluate: false,
    mergeGoldset: false,
    humanEvaluation: false,
  },
});

export function loadTuiSettings(): TuiSettings {
  const settingsPath = path.resolve(process.cwd(), TUI_SETTINGS_FILENAME);
  if (!fs.existsSync(settingsPath)) return defaultSettings();

  try {
    const saved = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    const defaults = defaultSettings();
    const savedStages = saved.stages && typeof saved.stages === "object" ? saved.stages : {};
    return {
      selectedModelIds: Array.isArray(saved.selectedModelIds)
        ? saved.selectedModelIds.filter((id: unknown): id is string => typeof id === "string")
        : defaults.selectedModelIds,
      stages: Object.fromEntries(
        Object.keys(defaults.stages).map((stage) => [
          stage,
          typeof savedStages[stage] === "boolean" ? savedStages[stage] : defaults.stages[stage as keyof typeof defaults.stages],
        ]),
      ) as TuiSettings["stages"],
    };
  } catch {
    return defaultSettings();
  }
}

export function saveTuiSettings(settings: TuiSettings): void {
  const settingsPath = path.resolve(process.cwd(), TUI_SETTINGS_FILENAME);
  fs.writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}
