it('blocks parent and sibling directories', () => {
    const allowed = ['/test/allowed'];

    // Parent directory
    expect(isPathWithinAllowedDirectories('/test', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/', allowed)).toBe(false);

    // Sibling with common prefix
    expect(isPathWithinAllowedDirectories('/test/allowed_sibling', allowed)).toBe(false);
    expect(isPathWithinAllowedDirectories('/test/allowed2', allowed)).toBe(false);
  })