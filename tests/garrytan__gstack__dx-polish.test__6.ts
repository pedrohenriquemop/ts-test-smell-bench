it('suggests closest match within Levenshtein 2 when input length >= 4', () => {
    const msg = buildUnknownCommandError('load-htm', ALL_COMMANDS);
    expect(msg).toContain(`Did you mean 'load-html'?`);
  })