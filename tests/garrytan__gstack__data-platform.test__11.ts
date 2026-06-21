it('all new commands have descriptions', () => {
    // The load-time validation in commands.ts throws if any command
    // is missing from COMMAND_DESCRIPTIONS. If this import succeeds,
    // all commands are properly registered.
    const { COMMAND_DESCRIPTIONS, ALL_COMMANDS } = require('../src/commands');
    const newCommands = ['media', 'data', 'download', 'scrape', 'archive'];
    for (const cmd of newCommands) {
      expect(ALL_COMMANDS.has(cmd)).toBe(true);
      expect(COMMAND_DESCRIPTIONS[cmd]).toBeTruthy();
    }
  })