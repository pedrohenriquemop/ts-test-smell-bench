it('should handle glob patterns correctly', async () => {
        const tree = await buildTreeForTesting(testDir, testDir, ['*.env']);
        const fileNames = tree.map(entry => entry.name);
        
        expect(fileNames).not.toContain('.env');
        expect(fileNames).toContain('.env.local'); // *.env should not match .env.local
        expect(fileNames).toContain('src');
    })