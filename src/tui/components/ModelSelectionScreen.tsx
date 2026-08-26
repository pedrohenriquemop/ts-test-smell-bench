import React, { useState, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ModelConfig } from '../../config/index.ts';

interface Props {
  models: ModelConfig[];
  onStart: (selectedModelIds: string[], stages: Record<string, boolean>) => void;
  onExit: () => void;
}

/**
 * Classifies a model as SLM (local/ollama) or LLM (cloud API: gemini, openai).
 */
function isSlm(model: ModelConfig): boolean {
  return model.provider === 'ollama';
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
    analyze: true,   // "Prepare Gold Set" — uses LLMs
    evaluate: true,   // "Evaluate" — uses SLMs
  });

  // Split models by type
  const llmModels = useMemo(() => models.filter(m => !isSlm(m)), [models]);
  const slmModels = useMemo(() => models.filter(m => isSlm(m)), [models]);

  // Determine which model sections to show based on selected stages
  const showLlmModels = stages.analyze;
  const showSlmModels = stages.evaluate;

  // Build the menu items dynamically
  const menuItems = useMemo(() => {
    const items: Array<{ type: 'model' | 'stage' | 'separator' | 'action'; id: string; label: string; category?: 'llm' | 'slm' }> = [];

    // ── Stage toggles ──────────────────────────────────────────
    items.push({ type: 'stage', id: 'mine', label: 'Stage: Mine (Download tests)' });
    items.push({ type: 'stage', id: 'prepare', label: 'Stage: Prepare (Slice data)' });
    items.push({ type: 'stage', id: 'analyze', label: 'Stage: Prepare Gold Set (Run LLM)' });
    items.push({ type: 'stage', id: 'evaluate', label: 'Stage: Evaluate (Run SLM & Metrics)' });

    // ── LLM models (only when "Prepare Gold Set" is active) ───
    if (showLlmModels && llmModels.length > 0) {
      items.push({ type: 'separator', id: 'sep-llm', label: '── LLM Models (Gold Set) ──' });
      for (const m of llmModels) {
        items.push({
          type: 'model',
          id: m.id,
          label: `${m.name || m.id} (${m.provider})`,
          category: 'llm',
        });
      }
    }

    // ── SLM models (only when "Evaluate" is active) ───────────
    if (showSlmModels && slmModels.length > 0) {
      items.push({ type: 'separator', id: 'sep-slm', label: '── SLM Models (Evaluate) ──' });
      for (const m of slmModels) {
        items.push({
          type: 'model',
          id: m.id,
          label: `${m.name || m.id} (${m.provider})`,
          category: 'slm',
        });
      }
    }

    // ── Actions ───────────────────────────────────────────────
    items.push({ type: 'action', id: 'start', label: '▶ START PIPELINE' });
    items.push({ type: 'action', id: 'exit', label: '✖ EXIT' });

    return items;
  }, [showLlmModels, showSlmModels, llmModels, slmModels]);

  // Check if at least one relevant model is selected for the active stages
  const needsModels = stages.analyze || stages.evaluate;
  const hasValidSelection = !needsModels || selectedModels.size > 0;

  useInput((input, key) => {
    if (key.upArrow) {
      setCursorIndex((prev) => {
        let next = Math.max(0, prev - 1);
        // Skip separator items
        while (next > 0 && menuItems[next]?.type === 'separator') next--;
        return next;
      });
    }
    if (key.downArrow) {
      setCursorIndex((prev) => {
        let next = Math.min(menuItems.length - 1, prev + 1);
        // Skip separator items
        while (next < menuItems.length - 1 && menuItems[next]?.type === 'separator') next++;
        return next;
      });
    }
    if (key.return || input === ' ') {
      const item = menuItems[cursorIndex];
      if (!item || item.type === 'separator') return;

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
          if (!hasValidSelection) return;
          // Only pass models relevant to the selected stages
          const relevantIds = Array.from(selectedModels).filter((id) => {
            const model = models.find((m) => m.id === id);
            if (!model) return false;
            if (stages.analyze && !isSlm(model)) return true;  // LLM for gold set
            if (stages.evaluate && isSlm(model)) return true;  // SLM for evaluate
            return false;
          });
          onStart(relevantIds, stages);
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

        if (item.type === 'separator') {
          return (
            <Box key={item.id} marginTop={1}>
              <Text color="yellow" bold>  {item.label}</Text>
            </Box>
          );
        }

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
        const bg = isSelected ? 'blackBright' : undefined;

        return (
          <Box key={item.id}>
            <Text color={color} backgroundColor={bg as any} bold={isSelected}>
              {isSelected ? '❯' : ' '} {prefix} {item.label}
            </Text>
          </Box>
        );
      })}

      {!hasValidSelection && (
        <Box marginTop={1}>
          <Text color="red">⚠ Please select at least one model to start.</Text>
        </Box>
      )}
    </Box>
  );
};
