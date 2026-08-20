import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { runPipeline } from '../../pipeline/index.ts';
import type { AppConfig } from '../../config/index.ts';

interface Props {
  config: AppConfig;
  modelIds: string[];
  stages: {
    mine: boolean;
    prepare: boolean;
    analyze: boolean;
    evaluate: boolean;
  };
  onComplete: () => void;
  onError: (error: string) => void;
}

export const ExecutionScreen: React.FC<Props> = ({ config, modelIds, stages, onComplete, onError }) => {
  const [currentStage, setCurrentStage] = useState<string>('Initializing...');
  const [currentModel, setCurrentModel] = useState<string | undefined>();
  const [logs, setLogs] = useState<string[]>([]);

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

    console.log = (...args) => pushLog(args.join(' '));
    console.warn = (...args) => pushLog('⚠ ' + args.join(' '));
    console.error = (...args) => pushLog('✖ ' + args.join(' '));

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
          }
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
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
      <Box marginBottom={1}>
        <Text color="yellow" bold>
          <Spinner type="dots" /> Running Pipeline...
        </Text>
      </Box>

      <Box flexDirection="row" marginBottom={1}>
        <Text color="white">Stage: </Text>
        <Text color="cyan" bold>{currentStage.toUpperCase()}</Text>
        {currentModel && (
          <>
            <Text color="white"> | Model: </Text>
            <Text color="magenta" bold>{currentModel}</Text>
          </>
        )}
      </Box>

      <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1}>
        {logs.length === 0 && <Text color="gray">Waiting for output...</Text>}
        {logs.map((log, idx) => (
          <Text key={idx} color="gray">{log}</Text>
        ))}
      </Box>
    </Box>
  );
};
