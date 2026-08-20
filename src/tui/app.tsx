import React, { useState } from 'react';
import { Box, Text } from 'ink';
import type { AppConfig } from '../../config/index.ts';
import { ModelSelectionScreen } from './components/ModelSelectionScreen.tsx';
import { ExecutionScreen } from './components/ExecutionScreen.tsx';
import { ResultsScreen } from './components/ResultsScreen.tsx';

interface Props {
  config: AppConfig;
  onExit: () => void;
}

type ScreenState = 'select' | 'execute' | 'results' | 'error';

export const App: React.FC<Props> = ({ config, onExit }) => {
  const [screen, setScreen] = useState<ScreenState>('select');
  
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
    setScreen('execute');
  };

  const handleExecutionComplete = () => {
    setScreen('results');
  };

  const handleError = (msg: string) => {
    setErrorMsg(msg);
    setScreen('error');
  };

  return (
    <Box flexDirection="column">
      {screen === 'select' && (
        <ModelSelectionScreen 
          models={config.models || []} 
          onStart={handleStart} 
          onExit={onExit} 
        />
      )}
      
      {screen === 'execute' && (
        <ExecutionScreen
          config={config}
          modelIds={selectedModels}
          stages={stages}
          onComplete={handleExecutionComplete}
          onError={handleError}
        />
      )}
      
      {screen === 'results' && (
        <ResultsScreen 
          config={config} 
          onExit={onExit} 
        />
      )}
      
      {screen === 'error' && (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="red">
          <Text color="red" bold>Pipeline Failed</Text>
          <Text color="white">{errorMsg}</Text>
          <Box marginTop={1}>
            <Text color="gray">Press any key to exit.</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
