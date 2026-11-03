import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import * as fs from "fs";
import * as path from "path";
import type { AppConfig } from "../config/index.ts";
import { ModelSelectionScreen } from "./components/ModelSelectionScreen.tsx";
import { ExecutionScreen } from "./components/ExecutionScreen.tsx";
import { ResultsScreen } from "./components/ResultsScreen.tsx";
import { ConfirmOverwriteScreen } from "./components/ConfirmOverwriteScreen.tsx";
import { loadTuiSettings, saveTuiSettings, type TuiStages } from "./settings.ts";

interface Props {
  config: AppConfig;
  onExit: () => void;
}

type Screen = "select" | "confirm-mine" | "confirm-prepare" | "execute" | "results" | "error";

function directoryHasFile(dir: string, matches: (file: string) => boolean): boolean {
  try {
    return fs.readdirSync(path.resolve(dir)).some(matches);
  } catch {
    return false;
  }
}

const ErrorScreen: React.FC<{ message: string | null; onExit: () => void }> = ({ message, onExit }) => {
  useInput(() => onExit());
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="red">
      <Text color="red" bold>
        Pipeline Failed
      </Text>
      <Text color="white">{message}</Text>
      <Box marginTop={1}>
        <Text color="gray">Press any key to exit.</Text>
      </Box>
    </Box>
  );
};

export const App: React.FC<Props> = ({ config, onExit }) => {
  const [screen, setScreen] = useState<Screen>("select");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [stages, setStages] = useState<TuiStages>(() => loadTuiSettings().stages);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const testsDir = config.miner.outputDir || "tests";
  const preparedDir = config.dataset.outputDir;

  const minedFilesWouldBeDeleted = (s: TuiStages) =>
    s.mine && directoryHasFile(testsDir, (f) => f.endsWith(".ts"));
  const preparedFilesWouldBeDeleted = (s: TuiStages) =>
    s.prepare &&
    directoryHasFile(
      preparedDir,
      (f) =>
        (f.startsWith("sampled_manifesto_") && f.endsWith(".json")) ||
        (f.startsWith("aggregated_tests_") && f.endsWith(".txt")),
    );

  const afterMineConfirmation = (s: TuiStages) =>
    setScreen(preparedFilesWouldBeDeleted(s) ? "confirm-prepare" : "execute");

  const handleStart = (models: string[], selectedStages: TuiStages) => {
    setSelectedModels(models);
    setStages(selectedStages);
    if (minedFilesWouldBeDeleted(selectedStages)) setScreen("confirm-mine");
    else afterMineConfirmation(selectedStages);
  };

  return (
    <Box flexDirection="column">
      {screen === "select" && (
        <ModelSelectionScreen
          models={config.models}
          onStart={handleStart}
          onExit={onExit}
          initialSettings={loadTuiSettings()}
          onSettingsChange={saveTuiSettings}
        />
      )}

      {screen === "confirm-mine" && (
        <ConfirmOverwriteScreen
          title="Existing Test Files Found"
          directory={testsDir}
          contents="test files"
          deletes="all existing .ts files"
          question="Are you sure you want to clear these files and mine again?"
          onConfirm={() => afterMineConfirmation(stages)}
          onCancel={() => setScreen("select")}
        />
      )}

      {screen === "confirm-prepare" && (
        <ConfirmOverwriteScreen
          title="Existing Prepared Data Found"
          directory={preparedDir}
          contents="prepared sliced data"
          deletes="the previous prepared dataset files"
          question="Are you sure you want to clean this previous data and prepare again?"
          onConfirm={() => setScreen("execute")}
          onCancel={() => setScreen("select")}
        />
      )}

      {screen === "execute" && (
        <ExecutionScreen
          config={config}
          modelIds={selectedModels}
          stages={stages}
          onComplete={() => setScreen("results")}
          onError={(message) => {
            setErrorMsg(message);
            setScreen("error");
          }}
        />
      )}

      {screen === "results" && <ResultsScreen config={config} stages={stages} onExit={onExit} />}

      {screen === "error" && <ErrorScreen message={errorMsg} onExit={onExit} />}
    </Box>
  );
};
