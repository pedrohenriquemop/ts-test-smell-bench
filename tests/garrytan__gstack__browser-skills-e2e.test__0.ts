test('defaultTierPaths resolves bundled tier to <repo>/browser-skills/', () => {
    const tiers = defaultTierPaths();
    expect(tiers.bundled).toMatch(/\/browser-skills$/);
    // Bundled tier should exist on disk (the reference skill is shipped).
    expect(require('fs').existsSync(tiers.bundled)).toBe(true);
  })