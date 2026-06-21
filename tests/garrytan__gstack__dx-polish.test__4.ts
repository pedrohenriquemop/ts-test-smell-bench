it('passes unknown names through unchanged (alias map is allowlist, not filter)', () => {
    expect(canonicalizeCommand('totally-made-up')).toBe('totally-made-up');
  })