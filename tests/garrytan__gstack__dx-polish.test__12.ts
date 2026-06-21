it('COMMAND_ALIASES + command set are consistent — all alias targets exist', () => {
    for (const target of Object.values(COMMAND_ALIASES)) {
      expect(ALL_COMMANDS.has(target)).toBe(true);
    }
  })