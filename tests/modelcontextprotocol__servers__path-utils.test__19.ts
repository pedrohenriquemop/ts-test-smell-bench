it('expands bare ~ to home directory', () => {
      const result = expandHome('~');
      expect(result).not.toContain('~');
      expect(result.length).toBeGreaterThan(0);
    })