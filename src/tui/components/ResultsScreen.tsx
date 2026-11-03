import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import * as fs from "fs";
import * as path from "path";
import type { AppConfig } from "../../config/index.ts";
import type { TuiStages } from "../settings.ts";

interface Props {
  config: AppConfig;
  stages: TuiStages;
  onExit: () => void;
}

export const ResultsScreen: React.FC<Props> = ({ config, stages, onExit }) => {
  const [summary, setSummary] = useState<Record<
    string,
    Record<string, number>
  > | null>(null);
  const [minedFilesCount, setMinedFilesCount] = useState<number>(0);

  useEffect(() => {
    if (stages.generateMetrics) {
      const summaryPath = path.resolve(config.analyzer.outputDir, "cross_model_summary.json");
      if (fs.existsSync(summaryPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
          setSummary(data);
        } catch {
          // A missing or malformed summary just hides the F1 table.
        }
      }
    }

    if (stages.mine) {
      const testsDir = path.resolve(config.miner.outputDir || "tests");
      if (fs.existsSync(testsDir)) {
        try {
          const files = fs
            .readdirSync(testsDir)
            .filter((f) => f.endsWith(".ts"));
          setMinedFilesCount(files.length);
        } catch {
          setMinedFilesCount(0);
        }
      }
    }
  }, [config, stages]);

  useInput((input, key) => {
    if (key.return || input === " " || key.escape || input === "q") {
      onExit();
    }
  });

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="green"
    >
      <Box marginBottom={1}>
        <Text color="green" bold>
          🎉 Pipeline Completed Successfully!
        </Text>
      </Box>

      {stages.mine && (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Mine Stage:</Text>
          <Text color="white">
            {" "}
            Downloaded {minedFilesCount} test files to{" "}
            {config.miner.outputDir || "./tests"}
          </Text>
        </Box>
      )}

      {stages.prepare && (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Prepare Stage:</Text>
          <Text color="white"> Dataset sliced and ready.</Text>
        </Box>
      )}

      {stages.humanEvaluation && (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Human Evaluation:</Text>
          <Text color="white"> Annotated tests saved to human_evaluation/processed_tests</Text>
        </Box>
      )}

      {stages.analyze && (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Prepare Gold Set:</Text>
          <Text color="white"> Gold set generated and saved to {config.analyzer.referenceResultsPath}</Text>
        </Box>
      )}

      {stages.mergeGoldset && (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Goldset Consensus:</Text>
          <Text color="white"> Created goldset/run.txt using strict-majority voting</Text>
        </Box>
      )}

      {stages.evaluate && (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Evaluate Stage:</Text>
          <Text color="white"> Model evaluations completed and saved to {config.analyzer.outputDir}</Text>
        </Box>
      )}

      {stages.generateMetrics && summary ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="cyan">
            ✓ Metrics & Analytics - Cross-Model F1 Score Summary:
          </Text>
          <Box flexDirection="column" marginY={1}>
            {Object.entries(summary).map(([smell, models]) => (
              <Box key={smell} flexDirection="row">
                <Box width={30}>
                  <Text>{smell}</Text>
                </Box>
                {Object.entries(models).map(([model, f1]) => (
                  <Box key={model} width={25}>
                    <Text
                      color={f1 > 0.8 ? "green" : f1 > 0.5 ? "yellow" : "red"}
                    >
                      {model}: {f1.toFixed(2)}
                    </Text>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      ) : stages.generateMetrics ? (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Metrics & Analytics Stage:</Text>
          <Text color="gray">
            {" "}
            Detailed metrics and charts saved to {config.analyzer.outputDir}
          </Text>
        </Box>
      ) : null}

      <Box marginTop={1}>
        <Text color="gray">Press Enter, Space, or Q to exit.</Text>
      </Box>
    </Box>
  );
};
