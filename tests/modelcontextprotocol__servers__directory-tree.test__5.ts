it('should work with multiple exclude patterns', async () => {
        const tree = await buildTreeForTesting(testDir, testDir, ['node_modules', '.env', '.git']);
        const entryNames = tree.map(entry => entry.name);
        
        expect(entryNames).not.toContain('node_modules');
        expect(entryNames).not.toContain('.env');
        expect(entryNames).not.toContain('.git');
        expect(entryNames).toContain('src');
        expect(entryNames).toContain('package.json');
    })