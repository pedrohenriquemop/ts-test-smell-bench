it('passes canonical names through unchanged', () => {
    expect(canonicalizeCommand('load-html')).toBe('load-html');
    expect(canonicalizeCommand('goto')).toBe('goto');
  })