import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import { runPipeline, type StageName } from "../../pipeline/index.ts";
import type { AppConfig } from "../../config/index.ts";
import type { TuiStages } from "../settings.ts";

interface Props {
  config: AppConfig;
  modelIds: string[];
  stages: TuiStages;
  onComplete: () => void;
  onError: (error: string) => void;
}

const MAX_LOG_LINES = 15;

const STAGE_DISPLAY_NAMES: Record<StageName, string> = {
  mine: "MINE",
  prepare: "PREPARE",
  humanEvaluation: "GENERATE HUMAN EVALUATION",
  analyze: "PREPARE GOLD SET",
  mergeGoldset: "MERGE GOLDSET RUNS",
  evaluate: "EVALUATE (RUN SLM)",
  sanitize: "SANITIZE MODEL SMELLS (AUTOMATIC)",
  generateMetrics: "GENERATE METRICS & ANALYTICS",
};

/** Redirects console output into the screen while the pipeline runs. */
function captureConsole(push: (line: string) => void): () => void {
  const original = { log: console.log, warn: console.warn, error: console.error };
  console.log = (...args) => push(args.join(" "));
  console.warn = (...args) => push(`⚠ ${args.join(" ")}`);
  console.error = (...args) => push(`✖ ${args.join(" ")}`);
  return () => Object.assign(console, original);
}

export const ExecutionScreen: React.FC<Props> = ({ config, modelIds, stages, onComplete, onError }) => {
  const [currentStage, setCurrentStage] = useState<StageName | undefined>();
  const [currentModel, setCurrentModel] = useState<string | undefined>();
  const [logs, setLogs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<{ message: string; resolve: (answer: boolean) => void } | null>(null);

  // The pipeline must start exactly once, even if the parent re-renders.
  const callbacks = useRef({ onComplete, onError });
  callbacks.current = { onComplete, onError };

  useInput((input) => {
    if (!prompt) return;
    const answer = input.toLowerCase();
    if (answer !== "y" && answer !== "n") return;
    prompt.resolve(answer === "y");
    setPrompt(null);
  });

  useEffect(() => {
    let isMounted = true;
    const restoreConsole = captureConsole((line) => {
      if (isMounted) setLogs((prev) => [...prev, line].slice(-MAX_LOG_LINES));
    });

    runPipeline({
      config,
      modelIds,
      stages,
      onStageStart: (stage, modelTag) => {
        if (!isMounted) return;
        setCurrentStage(stage);
        setCurrentModel(modelTag);
      },
      onStageError: () => false,
      onPrompt: (message) =>
        new Promise((resolve) => {
          if (isMounted) setPrompt({ message, resolve });
          else resolve(false);
        }),
    })
      .then(() => isMounted && callbacks.current.onComplete())
      .catch((err) => isMounted && callbacks.current.onError(err instanceof Error ? err.message : String(err)));

    return () => {
      isMounted = false;
      restoreConsole();
    };
  }, []);

  const accent = prompt ? "cyan" : "yellow";
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor={accent}>
      <Box marginBottom={1}>
        <Text color={accent} bold>
          {prompt ? "❓ Waiting for Input" : <><Spinner type="dots" /> Running Pipeline...</>}
        </Text>
      </Box>

      {prompt && (
        <Box marginBottom={1} padding={1} borderStyle="single" borderColor="cyan">
          <Text color="white" bold>
            {prompt.message} (y/n)
          </Text>
        </Box>
      )}

      <Box flexDirection="row" marginBottom={1}>
        <Text color="white">Stage: </Text>
        <Text color="cyan" bold>
          {currentStage ? STAGE_DISPLAY_NAMES[currentStage] : "Initializing..."}
        </Text>
        {currentModel && (
          <>
            <Text color="white"> | Model: </Text>
            <Text color="magenta" bold>
              {currentModel}
            </Text>
          </>
        )}
      </Box>

      <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1}>
        {logs.length === 0 && <Text color="gray">Waiting for output...</Text>}
        {logs.map((log, idx) => (
          <Text key={idx} color="gray">
            {log}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
