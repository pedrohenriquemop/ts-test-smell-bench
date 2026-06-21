it('names the input in every error', () => {
    const msg = buildUnknownCommandError('xyz', ALL_COMMANDS);
    expect(msg).toContain(`Unknown command: 'xyz'`);
  })