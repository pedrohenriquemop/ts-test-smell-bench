import React from "react";
import { Box, Text, useInput } from "ink";

interface Props {
  title: string;
  directory: string;
  /** What the directory already contains, e.g. "test files". */
  contents: string;
  /** What gets deleted, e.g. "all existing .ts files". */
  deletes: string;
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Yes/no warning before a stage deletes existing output; defaults to No. */
export const ConfirmOverwriteScreen: React.FC<Props> = ({
  title,
  directory,
  contents,
  deletes,
  question,
  onConfirm,
  onCancel,
}) => {
  useInput((input, key) => {
    if (input.toLowerCase() === "y") onConfirm();
    else if (input.toLowerCase() === "n" || key.escape || key.return) onCancel();
  });

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
      <Text color="yellow" bold>
        ⚠ Warning: {title}
      </Text>
      <Box marginY={1}>
        <Text>
          The directory <Text color="cyan">{directory}</Text> already contains {contents}.
        </Text>
      </Box>
      <Text>
        Continuing will{" "}
        <Text color="red" bold>
          DELETE
        </Text>{" "}
        {deletes} in this directory before proceeding.
      </Text>
      <Box marginTop={1}>
        <Text color="white" bold>
          {question} (y/N)
        </Text>
      </Box>
    </Box>
  );
};
