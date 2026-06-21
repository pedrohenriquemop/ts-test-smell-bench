it('does NOT suggest for short inputs (< 4 chars, avoids noise on js/is typos)', () => {
    // 'j' is distance 1 from 'js' but only 1 char — suggestion would be noisy
    const msg = buildUnknownCommandError('j', ALL_COMMANDS);
    expect(msg).not.toContain('Did you mean');
  })