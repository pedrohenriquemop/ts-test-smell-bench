import React, { useState } from "react";
import { Box, Text } from "ink";
import * as fs from "fs";
import * as path from "path";
import type { AppConfig } from "../config/index.ts";
import { ModelSelectionScreen } from "./components/ModelSelectionScreen.tsx";
import { ExecutionScreen } from "./components/ExecutionScreen.tsx";
import { ResultsScreen } from "./components/ResultsScreen.tsx";
import { ConfirmMineScreen } from "./components/ConfirmMineScreen.tsx";
import { ConfirmPrepareScreen } from "./components/ConfirmPrepareScreen.tsx";
import { loadTuiSettings, saveTuiSettings } from "./settings.ts";

interface Props {
  config: AppConfig;
  onExit: () => void;
}

type ScreenState =
  | "select"
  | "confirm-mine"
  | "confirm-prepare"
  | "execute"
  | "results"
  | "error";

export const App: React.FC<Props> = ({ config, onExit }) => {
  const [screen, setScreen] = useState<ScreenState>("select");

  // Execution state
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [stages, setStages] = useState({
    mine: false,
    prepare: false,
    analyze: false,
    evaluate: false,
    mergeGoldset: false,
    humanEvaluation: false,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkMineFiles = (stgs: Record<string, boolean>) => {
    if (!stgs.mine) return false;
    const testsDir = path.resolve(
      process.cwd(),
      config.miner.outputDir || "tests"
    );
    if (fs.existsSync(testsDir)) {
      try {
        return fs.readdirSync(testsDir).some((f) => f.endsWith(".ts"));
      } catch {
        return false;
      }
    }
    return false;
  };

  const checkPrepareFiles = (stgs: Record<string, boolean>) => {
    if (!stgs.prepare) return false;
    const prepareDir = path.resolve(
      process.cwd(),
      config.dataset.outputDir || "tests"
    );
    if (fs.existsSync(prepareDir)) {
      try {
        return fs
          .readdirSync(prepareDir)
          .some(
            (f) =>
              (f.startsWith("sampled_manifesto_") && f.endsWith(".json")) ||
              (f.startsWith("aggregated_tests_") && f.endsWith(".txt"))
          );
      } catch {
        return false;
      }
    }
    return false;
  };

  const handleStart = (models: string[], stgs: Record<string, boolean>) => {
    setSelectedModels(models);
    setStages(stgs as any);

    if (checkMineFiles(stgs)) {
      setScreen("confirm-mine");
    } else if (checkPrepareFiles(stgs)) {
      setScreen("confirm-prepare");
    } else {
      setScreen("execute");
    }
  };

  const handleConfirmMine = () => {
    if (checkPrepareFiles(stages)) {
      setScreen("confirm-prepare");
    } else {
      setScreen("execute");
    }
  };

  const handleExecutionComplete = () => {
    setScreen("results");
  };

  const handleError = (msg: string) => {
    setErrorMsg(msg);
    setScreen("error");
  };

  return (
    <Box flexDirection="column">
      {screen === "select" && (
        <ModelSelectionScreen
          models={config.models || []}
          onStart={handleStart}
          onExit={onExit}
          initialSettings={loadTuiSettings()}
          onSettingsChange={saveTuiSettings}
        />
      )}

      {screen === "confirm-mine" && (
        <ConfirmMineScreen
          testsDir={config.miner.outputDir || "tests"}
          onConfirm={handleConfirmMine}
          onCancel={() => setScreen("select")}
        />
      )}

      {screen === "confirm-prepare" && (
        <ConfirmPrepareScreen
          outputDir={config.dataset.outputDir || "tests"}
          onConfirm={() => setScreen("execute")}
          onCancel={() => setScreen("select")}
        />
      )}

      {screen === "execute" && (
        <ExecutionScreen
          config={config}
          modelIds={selectedModels}
          stages={stages}
          onComplete={handleExecutionComplete}
          onError={handleError}
        />
      )}

      {screen === "results" && (
        <ResultsScreen config={config} stages={stages} onExit={onExit} />
      )}

      {screen === "error" && (
        <Box
          flexDirection="column"
          padding={1}
          borderStyle="round"
          borderColor="red"
        >
          <Text color="red" bold>
            Pipeline Failed
          </Text>
          <Text color="white">{errorMsg}</Text>
          <Box marginTop={1}>
            <Text color="gray">Press any key to exit.</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
