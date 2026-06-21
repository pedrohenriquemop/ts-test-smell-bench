it('resolves setContent → load-html (case-sensitive key)', () => {
    expect(canonicalizeCommand('setContent')).toBe('load-html');
  })