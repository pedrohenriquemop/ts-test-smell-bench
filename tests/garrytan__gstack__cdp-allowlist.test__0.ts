it('every entry has all 4 required fields', () => {
    for (const entry of CDP_ALLOWLIST) {
      expect(entry.domain).toBeTruthy();
      expect(entry.method).toBeTruthy();
      expect(['tab', 'browser']).toContain(entry.scope);
      expect(['trusted', 'untrusted']).toContain(entry.output);
      expect(entry.justification).toBeTruthy();
      expect(entry.justification.length).toBeGreaterThan(20); // not a placeholder
    }
  })