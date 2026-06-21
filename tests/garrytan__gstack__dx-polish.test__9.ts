it('appends upgrade hint when command appears in NEW_IN_VERSION', () => {
    // Synthetic: pretend load-html isn't in the command set (agent on older build)
    const noLoadHtml = new Set([...ALL_COMMANDS].filter(c => c !== 'load-html'));
    const msg = buildUnknownCommandError('load-html', noLoadHtml, COMMAND_ALIASES, NEW_IN_VERSION);
    expect(msg).toContain('added in browse v');
    expect(msg).toContain('Upgrade:');
  })