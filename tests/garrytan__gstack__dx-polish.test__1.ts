it('resolves set-content → load-html', () => {
    expect(canonicalizeCommand('set-content')).toBe('load-html');
  })