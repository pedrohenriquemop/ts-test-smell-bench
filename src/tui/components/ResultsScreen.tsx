import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import * as fs from 'fs';
import * as path from 'path';
import type { AppConfig } from '../../config/index.ts';

interface Props {
  config: AppConfig;
  onExit: () => void;
}

export const ResultsScreen: React.FC<Props> = ({ config, onExit }) => {
  const [summary, setSummary] = useState<Record<string, Record<string, number>> | null>(null);

  useEffect(() => {
    const summaryPath = path.join(process.cwd(), config.analyzer.outputDir, 'cross_model_summary.json');
    if (fs.existsSync(summaryPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
        setSummary(data);
      } catch {
        // Ignore
      }
    }
  }, [config]);

  useInput((input, key) => {
    if (key.return || input === ' ' || key.escape || input === 'q') {
      onExit();
    }
  });

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="green">
      <Box marginBottom={1}>
        <Text color="green" bold>🎉 Pipeline Completed Successfully!</Text>
      </Box>

      {summary ? (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color="cyan">Cross-Model F1 Score Summary:</Text>
          <Box flexDirection="column" marginY={1}>
            {Object.entries(summary).map(([smell, models]) => (
              <Box key={smell} flexDirection="row">
                <Box width={30}>
                  <Text>{smell}</Text>
                </Box>
                {Object.entries(models).map(([model, f1]) => (
                  <Box key={model} width={25}>
                    <Text color={f1 > 0.8 ? 'green' : f1 > 0.5 ? 'yellow' : 'red'}>
                      {model}: {f1.toFixed(2)}
                    </Text>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box marginBottom={1}>
          <Text color="gray">Detailed results saved to {config.analyzer.outputDir}</Text>
        </Box>
      )}

      <Box>
        <Text color="gray">Press Enter, Space, or Q to exit.</Text>
      </Box>
    </Box>
  );
};
