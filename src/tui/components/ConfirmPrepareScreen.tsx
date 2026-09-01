import React from "react";
import { Box, Text, useInput } from "ink";

interface Props {
  outputDir: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmPrepareScreen: React.FC<Props> = ({
  outputDir,
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
        ⚠ Warning: Existing Prepared Data Found
      </Text>
      <Box marginY={1}>
        <Text>
          The directory <Text color="cyan">{outputDir}</Text> already contains
          prepared sliced data.
        </Text>
      </Box>
      <Text>
        Preparing again will{" "}
        <Text color="red" bold>
          DELETE
        </Text>{" "}
        the previous prepared dataset files in this directory before proceeding.
      </Text>
      <Box marginTop={1}>
        <Text color="white" bold>
          Are you sure you want to clean this previous data and prepare again? (y/N)
        </Text>
      </Box>
    </Box>
  );
};
