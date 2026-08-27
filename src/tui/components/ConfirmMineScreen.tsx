import React from "react";
import { Box, Text, useInput } from "ink";

interface Props {
  testsDir: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmMineScreen: React.FC<Props> = ({
  testsDir,
  onConfirm,
  onCancel,
}) => {
  useInput((input, key) => {
    if (input.toLowerCase() === "y") {
      onConfirm();
    } else if (input.toLowerCase() === "n" || key.escape || key.return) {
      // Default to cancel on return
      onCancel();
    }
  });

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="yellow"
    >
      <Text color="yellow" bold>
        ⚠ Warning: Existing Test Files Found
      </Text>
      <Box marginY={1}>
        <Text>
          The directory <Text color="cyan">{testsDir}</Text> already contains
          test files.
        </Text>
      </Box>
      <Text>
        Mining again will{" "}
        <Text color="red" bold>
          DELETE
        </Text>{" "}
        all existing .ts files in this directory before proceeding.
      </Text>
      <Box marginTop={1}>
        <Text color="white" bold>
          Are you sure you want to clear these files and mine again? (y/N)
        </Text>
      </Box>
    </Box>
  );
};
