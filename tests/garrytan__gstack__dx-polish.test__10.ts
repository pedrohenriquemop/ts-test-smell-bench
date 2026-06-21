it('omits upgrade hint for unknown commands not in NEW_IN_VERSION', () => {
    const msg = buildUnknownCommandError('notarealcommand', ALL_COMMANDS);
    expect(msg).not.toContain('added in browse v');
  })