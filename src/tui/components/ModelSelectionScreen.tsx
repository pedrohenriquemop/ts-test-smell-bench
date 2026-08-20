import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ModelConfig } from '../../config/index.ts';

interface Props {
  models: ModelConfig[];
  onStart: (selectedModelIds: string[], stages: Record<string, boolean>) => void;
  onExit: () => void;
}

export const ModelSelectionScreen: React.FC<Props> = ({ models, onStart, onExit }) => {
  const [cursorIndex, setCursorIndex] = useState(0);
  
  // State for selections
  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    new Set(models.map(m => m.id)) // Default select all
  );
  const [stages, setStages] = useState({
    mine: false,
    prepare: false,
    analyze: true,
    evaluate: true,
  });

  const menuItems = [
    ...models.map((m) => ({ type: 'model' as const, id: m.id, label: `Model: ${m.name || m.id} (${m.provider})` })),
    { type: 'stage' as const, id: 'mine', label: 'Stage: Mine (Download tests)' },
    { type: 'stage' as const, id: 'prepare', label: 'Stage: Prepare (Slice data)' },
    { type: 'stage' as const, id: 'analyze', label: 'Stage: Analyze (Run LLM)' },
    { type: 'stage' as const, id: 'evaluate', label: 'Stage: Evaluate (Metrics)' },
    { type: 'action' as const, id: 'start', label: '▶ START PIPELINE' },
    { type: 'action' as const, id: 'exit', label: '✖ EXIT' },
  ];

  useInput((input, key) => {
    if (key.upArrow) {
      setCursorIndex((prev) => Math.max(0, prev - 1));
    }
    if (key.downArrow) {
      setCursorIndex((prev) => Math.min(menuItems.length - 1, prev + 1));
    }
    if (key.return || input === ' ') {
      const item = menuItems[cursorIndex];
      if (item.type === 'model') {
        setSelectedModels((prev) => {
          const next = new Set(prev);
          if (next.has(item.id)) next.delete(item.id);
          else next.add(item.id);
          return next;
        });
      } else if (item.type === 'stage') {
        setStages((prev) => ({ ...prev, [item.id]: !prev[item.id as keyof typeof stages] }));
      } else if (item.type === 'action') {
        if (item.id === 'start') {
          if (selectedModels.size === 0) return; // Prevent start without models
          onStart(Array.from(selectedModels), stages);
        } else if (item.id === 'exit') {
          onExit();
        }
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
      <Box marginBottom={1}>
        <Text bold color="cyan">=== Pipeline Configuration ===</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="gray">Use ↑/↓ to navigate, Space/Enter to toggle.</Text>
      </Box>

      {menuItems.map((item, idx) => {
        const isSelected = cursorIndex === idx;
        let isChecked = false;
        
        if (item.type === 'model') isChecked = selectedModels.has(item.id);
        if (item.type === 'stage') isChecked = stages[item.id as keyof typeof stages];

        let prefix = '  ';
        if (item.type !== 'action') {
          prefix = isChecked ? ' [x] ' : ' [ ] ';
        } else {
          prefix = '  ';
        }

        const color = isSelected ? 'green' : 'white';
        const bg = isSelected ? 'bgBlackBright' : undefined;

        return (
          <Box key={item.id}>
            <Text color={color} backgroundColor={bg as any} bold={isSelected}>
              {isSelected ? '❯' : ' '} {prefix} {item.label}
            </Text>
          </Box>
        );
      })}

      {selectedModels.size === 0 && (
        <Box marginTop={1}>
          <Text color="red">⚠ Please select at least one model to start.</Text>
        </Box>
      )}
    </Box>
  );
};
