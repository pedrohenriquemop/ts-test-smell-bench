it('reproduces exact scenario from issue #2795', () => {
      // Simulate running inside WSL: wsl npx @modelcontextprotocol/server-filesystem /mnt/c/Users/username/folder
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
        configurable: true
      });

      // This is the exact path from the issue
      const inputPath = '/mnt/c/Users/username/folder';
      const result = normalizePath(inputPath);

      // Should NOT convert to C:\Users\username\folder
      expect(result).toBe('/mnt/c/Users/username/folder');
      expect(result).not.toContain('C:');
      expect(result).not.toContain('\\');
    })