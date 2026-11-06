import React, { useMemo, useState } from "react";
import { Box, Text, useInput } from "ink";
import { PROMPT_VARIANTS, type ModelConfig, type PromptVariant } from "../../config/index.ts";
import type { EvaluationRun } from "../../pipeline/index.ts";
import { APP_VERSION } from "../../version.ts";
import { evaluationRunKey, type TuiSettings, type TuiStages } from "../settings.ts";

interface Props {
  models: ModelConfig[];
  onStart: (goldsetModelIds: string[], runs: EvaluationRun[], stages: TuiStages) => void;
  onExit: () => void;
  initialSettings: TuiSettings;
  onSettingsChange: (settings: TuiSettings) => void;
}

type MenuItem =
  | { type: "stage"; id: keyof TuiStages; label: string }
  | { type: "separator"; id: string; label: string }
  | { type: "model"; id: string; label: string }
  /** Toggles every variant of one local model at once. */
  | { type: "group"; id: string; label: string; runKeys: string[] }
  | { type: "run"; id: string; label: string }
  | { type: "action"; id: "start" | "exit"; label: string };

const STAGE_LABELS: Array<[keyof TuiStages, string]> = [
  ["mine", "Stage: Mine (Download tests)"],
  ["prepare", "Stage: Prepare (Slice data)"],
  ["humanEvaluation", "Stage: Generate Human Evaluation"],
  ["analyze", "Stage: Prepare Gold Set (Run LLM)"],
  ["mergeGoldset", "Stage: Merge Goldset Runs (Strict Majority)"],
  ["evaluate", "Stage: Evaluate (Run SLMs)"],
  ["generateMetrics", "Stage: Generate Metrics & Analytics (Charts & Report)"],
];

/** Local Ollama models are the evaluated SLMs; cloud models label the goldset. */
const isSlm = (model: ModelConfig) => model.provider === "ollama";

const variantLabel = (v: PromptVariant) =>
  `CoT ${v.useChainOfThought ? "on " : "off"} · AST ${v.includeAstMetrics ? "on " : "off"}`;

export const ModelSelectionScreen: React.FC<Props> = ({
  models,
  onStart,
  onExit,
  initialSettings,
  onSettingsChange,
}) => {
  const llmModels = useMemo(() => models.filter((m) => !isSlm(m)), [models]);
  const slmModels = useMemo(() => models.filter(isSlm), [models]);
  const allRuns = useMemo(
    () => slmModels.flatMap((m) => PROMPT_VARIANTS.map((v): EvaluationRun => ({ modelId: m.id, ...v }))),
    [slmModels],
  );

  const [cursorIndex, setCursorIndex] = useState(0);
  const [selectedModels, setSelectedModels] = useState(
    () => new Set(initialSettings.selectedModelIds.filter((id) => llmModels.some((m) => m.id === id))),
  );
  const [selectedRuns, setSelectedRuns] = useState(
    () => new Set(initialSettings.selectedRunKeys.filter((key) => allRuns.some((r) => evaluationRunKey(r) === key))),
  );
  const [stages, setStages] = useState<TuiStages>({ ...initialSettings.stages });

  const persist = (nextModels: Set<string>, nextRuns: Set<string>, nextStages: TuiStages) =>
    onSettingsChange({
      selectedModelIds: [...nextModels],
      selectedRunKeys: [...nextRuns],
      stages: nextStages,
    });

  const showLlmModels = stages.analyze;
  const showSlmRuns = stages.evaluate || stages.generateMetrics;

  const menuItems = useMemo(() => {
    const items: MenuItem[] = STAGE_LABELS.map(([id, label]) => ({ type: "stage", id, label }));

    if (showLlmModels && llmModels.length > 0) {
      items.push({ type: "separator", id: "sep-llm", label: "── LLM Models (Gold Set) ──" });
      for (const m of llmModels) items.push({ type: "model", id: m.id, label: `${m.id} (${m.provider})` });
    }

    if (showSlmRuns && slmModels.length > 0) {
      items.push({ type: "separator", id: "sep-slm", label: "── SLM Models (Evaluation) ──" });
      for (const m of slmModels) {
        const runs = allRuns.filter((r) => r.modelId === m.id);
        items.push({ type: "group", id: `group-${m.id}`, label: `${m.id} (all variants)`, runKeys: runs.map(evaluationRunKey) });
        for (const run of runs) {
          items.push({ type: "run", id: evaluationRunKey(run), label: `   ${variantLabel(run)}` });
        }
      }
    }

    items.push({ type: "action", id: "start", label: "▶ START PIPELINE" });
    items.push({ type: "action", id: "exit", label: "✖ EXIT" });
    return items;
  }, [showLlmModels, showSlmRuns, llmModels, slmModels, allRuns]);

  // The menu shrinks when stages are toggled off.
  const cursor = Math.min(cursorIndex, menuItems.length - 1);

  const goldsetModelIds = stages.analyze ? [...selectedModels] : [];
  const evaluationRuns = showSlmRuns ? allRuns.filter((r) => selectedRuns.has(evaluationRunKey(r))) : [];
  const missingGoldsetModel = stages.analyze && goldsetModelIds.length === 0;
  const missingRuns = showSlmRuns && evaluationRuns.length === 0;

  const toggleRuns = (keys: string[]) => {
    const next = new Set(selectedRuns);
    const allSelected = keys.every((key) => next.has(key));
    for (const key of keys) {
      if (allSelected) next.delete(key);
      else next.add(key);
    }
    setSelectedRuns(next);
    persist(selectedModels, next, stages);
  };

  const move = (step: 1 | -1) =>
    setCursorIndex((prev) => {
      let next = Math.min(menuItems.length - 1, Math.max(0, Math.min(prev, menuItems.length - 1) + step));
      while (menuItems[next]?.type === "separator" && next > 0 && next < menuItems.length - 1) next += step;
      return next;
    });

  useInput((input, key) => {
    if (key.upArrow) move(-1);
    if (key.downArrow) move(1);
    if (!key.return && input !== " ") return;

    const item = menuItems[cursor];
    switch (item?.type) {
      case "model": {
        const next = new Set(selectedModels);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        setSelectedModels(next);
        persist(next, selectedRuns, stages);
        break;
      }
      case "group":
        toggleRuns(item.runKeys);
        break;
      case "run":
        toggleRuns([item.id]);
        break;
      case "stage": {
        const next = { ...stages, [item.id]: !stages[item.id] };
        setStages(next);
        persist(selectedModels, selectedRuns, next);
        break;
      }
      case "action":
        if (item.id === "exit") onExit();
        else if (!missingGoldsetModel && !missingRuns) onStart(goldsetModelIds, evaluationRuns, stages);
        break;
    }
  });

  const isChecked = (item: MenuItem) => {
    switch (item.type) {
      case "stage": return stages[item.id];
      case "model": return selectedModels.has(item.id);
      case "run": return selectedRuns.has(item.id);
      case "group": return item.runKeys.every((k) => selectedRuns.has(k));
      default: return false;
    }
  };

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          === Pipeline Configuration (v{APP_VERSION}) ===
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="gray">Use ↑/↓ to navigate, Space/Enter to toggle. A model row toggles all of its variants.</Text>
        <Text color="yellow">Automatic stage: Sanitize model smells; it runs before metrics.</Text>
      </Box>

      {menuItems.map((item, idx) => {
        if (item.type === "separator") {
          return (
            <Box key={item.id} marginTop={1}>
              <Text color="yellow" bold>
                {" "}
                {item.label}
              </Text>
            </Box>
          );
        }

        const selected = cursor === idx;
        const someChecked = item.type === "group" && item.runKeys.some((k) => selectedRuns.has(k));
        const box = isChecked(item) ? "[x]" : someChecked ? "[-]" : "[ ]";
        const prefix = item.type === "action" ? "  " : ` ${box} `;
        return (
          <Box key={item.id}>
            <Text
              color={selected ? "green" : item.type === "group" ? "cyan" : "white"}
              backgroundColor={selected ? "blackBright" : undefined}
              bold={selected || item.type === "group"}
            >
              {selected ? "❯" : " "} {prefix} {item.label}
            </Text>
          </Box>
        );
      })}

      <Box marginTop={1} flexDirection="column">
        {showSlmRuns && evaluationRuns.length > 0 && (
          <Text color="gray">{evaluationRuns.length} evaluation run(s) selected.</Text>
        )}
        {missingGoldsetModel && <Text color="red">⚠ Select a cloud model to generate the gold set.</Text>}
        {missingRuns && <Text color="red">⚠ Select at least one model variant to evaluate.</Text>}
      </Box>
    </Box>
  );
};
