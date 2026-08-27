import React, { useState } from "react";
import { Box, Text } from "ink";
import * as fs from "fs";
import * as path from "path";
import type { AppConfig } from "../../config/index.ts";
import { ModelSelectionScreen } from "./components/ModelSelectionScreen.tsx";
import { ExecutionScreen } from "./components/ExecutionScreen.tsx";
import { ResultsScreen } from "./components/ResultsScreen.tsx";
import { ConfirmMineScreen } from "./components/ConfirmMineScreen.tsx";

interface Props {
  config: AppConfig;
  onExit: () => void;
}

type ScreenState = "select" | "confirm-mine" | "execute" | "results" | "error";

export const App: React.FC<Props> = ({ config, onExit }) => {
  const [screen, setScreen] = useState<ScreenState>("select");

  // Execution state
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [stages, setStages] = useState({
    mine: false,
    prepare: false,
    analyze: false,
    evaluate: false,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStart = (models: string[], stgs: Record<string, boolean>) => {
    setSelectedModels(models);
    setStages(stgs as any);

    // Check if we need to confirm mine directory clearance
    if (stgs.mine) {
      const testsDir = path.resolve(
        process.cwd(),
        config.miner.outputDir || "tests",
      );
      if (fs.existsSync(testsDir)) {
        try {
          const hasTsFiles = fs
            .readdirSync(testsDir)
            .some((f) => f.endsWith(".ts"));
          if (hasTsFiles) {
            setScreen("confirm-mine");
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    setScreen("execute");
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
        />
      )}

      {screen === "confirm-mine" && (
        <ConfirmMineScreen
          testsDir={config.miner.outputDir || "tests"}
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
