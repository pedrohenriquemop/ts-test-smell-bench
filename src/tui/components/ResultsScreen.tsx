import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import * as fs from "fs";
import * as path from "path";
import type { AppConfig } from "../../config/index.ts";

interface Props {
  config: AppConfig;
  stages: {
    mine: boolean;
    prepare: boolean;
    analyze: boolean;
    evaluate: boolean;
    humanEvaluation: boolean;
  };
  onExit: () => void;
}

export const ResultsScreen: React.FC<Props> = ({ config, stages, onExit }) => {
  const [summary, setSummary] = useState<Record<
    string,
    Record<string, number>
  > | null>(null);
  const [minedFilesCount, setMinedFilesCount] = useState<number>(0);

  useEffect(() => {
    // If evaluation ran, try to load summary
    if (stages.evaluate) {
      const summaryPath = path.join(
        process.cwd(),
        config.analyzer.outputDir,
        "cross_model_summary.json",
      );
      if (fs.existsSync(summaryPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
          setSummary(data);
        } catch {
          // Ignore
        }
      }
    }

    // If mine ran, count the files
    if (stages.mine) {
      const testsDir = path.join(
        process.cwd(),
        config.miner.outputDir || "tests",
      );
      if (fs.existsSync(testsDir)) {
        try {
          const files = fs
            .readdirSync(testsDir)
            .filter((f) => f.endsWith(".ts"));
          setMinedFilesCount(files.length);
        } catch {
          // Ignore
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

      {(stages.analyze || stages.evaluate) && summary ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="cyan">
            ✓ Evaluate Stage - Cross-Model F1 Score Summary:
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
      ) : stages.analyze || stages.evaluate ? (
        <Box marginBottom={1}>
          <Text color="cyan">✓ Analyze/Evaluate Stage:</Text>
          <Text color="gray">
            {" "}
            Detailed results saved to {config.analyzer.outputDir}
          </Text>
        </Box>
      ) : null}

      <Box marginTop={1}>
        <Text color="gray">Press Enter, Space, or Q to exit.</Text>
      </Box>
    </Box>
  );
};
