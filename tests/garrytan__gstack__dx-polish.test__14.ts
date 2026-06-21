it('setcontent is NOT directly in any scope set (must canonicalize first)', async () => {
    const { SCOPE_WRITE, SCOPE_READ, SCOPE_ADMIN, SCOPE_CONTROL } = await import('../src/token-registry');
    // The alias itself must NOT appear in any scope set — only the canonical form.
    // This proves scope enforcement relies on canonicalization at dispatch time,
    // not on the alias leaking through as an acceptable command.
    expect(SCOPE_WRITE.has('setcontent')).toBe(false);
    expect(SCOPE_READ.has('setcontent')).toBe(false);
    expect(SCOPE_ADMIN.has('setcontent')).toBe(false);
    expect(SCOPE_CONTROL.has('setcontent')).toBe(false);
  })