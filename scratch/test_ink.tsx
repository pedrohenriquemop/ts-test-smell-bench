import React from 'react';
import { render, Text, Box } from 'ink';

const App = () => (
  <Box borderStyle="round" borderColor="green" padding={1}>
    <Text color="cyan">Hello from Ink TUI!</Text>
  </Box>
);

render(<App />);
