it('no duplicate (domain.method) entries', () => {
    const seen = new Set<string>();
    for (const e of CDP_ALLOWLIST) {
      const key = `${e.domain}.${e.method}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  })