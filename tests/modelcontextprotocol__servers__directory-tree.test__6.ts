it('should handle empty exclude patterns', async () => {
        const tree = await buildTreeForTesting(testDir, testDir, []);
        const entryNames = tree.map(entry => entry.name);
        
        // All entries should be included
        expect(entryNames).toContain('node_modules');
        expect(entryNames).toContain('.env');
        expect(entryNames).toContain('.git');
        expect(entryNames).toContain('src');
    })