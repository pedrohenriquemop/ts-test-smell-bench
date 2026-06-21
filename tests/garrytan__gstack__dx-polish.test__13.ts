it('load-html is in SCOPE_WRITE (alias canonicalization happens before scope check)', async () => {
    const { SCOPE_WRITE } = await import('../src/token-registry');
    expect(SCOPE_WRITE.has('load-html')).toBe(true);
  })