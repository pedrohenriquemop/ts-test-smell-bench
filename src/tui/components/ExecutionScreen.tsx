import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import { runPipeline } from "../../pipeline/index.ts";
import type { AppConfig } from "../../config/index.ts";

interface Props {
  config: AppConfig;
  modelIds: string[];
  stages: {
    mine: boolean;
    prepare: boolean;
    analyze: boolean;
    evaluate: boolean;
    mergeGoldset: boolean;
    humanEvaluation: boolean;
  };
  onComplete: () => void;
  onError: (error: string) => void;
}

const STAGE_DISPLAY_NAMES: Record<string, string> = {
  mine: "MINE",
  prepare: "PREPARE",
  analyze: "PREPARE GOLD SET",
  evaluate: "EVALUATE",
  mergeGoldset: "MERGE GOLDSET RUNS",
  humanEvaluation: "GENERATE HUMAN EVALUATION",
};

function stageDisplayName(stage: string): string {
  return STAGE_DISPLAY_NAMES[stage] ?? stage.toUpperCase();
}

export const ExecutionScreen: React.FC<Props> = ({
  config,
  modelIds,
  stages,
  onComplete,
  onError,
}) => {
  const [currentStage, setCurrentStage] = useState<string>("Initializing...");
  const [currentModel, setCurrentModel] = useState<string | undefined>();
  const [logs, setLogs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<{ message: string; resolve: (val: boolean) => void } | null>(null);

  useInput((input, key) => {
    if (!prompt) return;
    
    if (input.toLowerCase() === "y") {
      prompt.resolve(true);
      setPrompt(null);
    } else if (input.toLowerCase() === "n") {
      prompt.resolve(false);
      setPrompt(null);
    }
  });

  useEffect(() => {
    let isMounted = true;

    // Override console.log/warn/error to capture logs in TUI
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const pushLog = (msg: string) => {
      if (!isMounted) return;
      setLogs((prev) => {
        const next = [...prev, msg];
        return next.slice(-15); // keep last 15 logs
      });
    };

    console.log = (...args) => pushLog(args.join(" "));
    console.warn = (...args) => pushLog("⚠ " + args.join(" "));
    console.error = (...args) => pushLog("✖ " + args.join(" "));

    const execute = async () => {
      try {
        await runPipeline({
          config,
          modelIds,
          stages,
          onStageStart: (stage, modelId) => {
            if (!isMounted) return;
            setCurrentStage(stage);
            setCurrentModel(modelId);
          },
          onStageComplete: () => {
            // Let it spin until next stage
          },
          onStageError: (stage, error, modelId) => {
            if (!isMounted) return false;
            // Let it crash
            return false;
          },
          onPrompt: (message) => {
            return new Promise((resolve) => {
              if (!isMounted) {
                resolve(false);
                return;
              }
              setPrompt({ message, resolve });
            });
          },
        });

        if (isMounted) {
          onComplete();
        }
      } catch (err) {
        if (isMounted) {
          onError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    execute();

    return () => {
      isMounted = false;
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, [config, modelIds, stages, onComplete, onError]);

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor={prompt ? "cyan" : "yellow"}
    >
      <Box marginBottom={1}>
        <Text color={prompt ? "cyan" : "yellow"} bold>
          {prompt ? <Text>❓ Waiting for Input</Text> : <Text><Spinner type="dots" /> Running Pipeline...</Text>}
        </Text>
      </Box>

      {prompt && (
        <Box marginBottom={1} padding={1} borderStyle="single" borderColor="cyan">
          <Text color="white" bold>{prompt.message} (y/n)</Text>
        </Box>
      )}

      <Box flexDirection="row" marginBottom={1}>
        <Text color="white">Stage: </Text>
        <Text color="cyan" bold>
          {stageDisplayName(currentStage)}
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

      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={1}
      >
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
