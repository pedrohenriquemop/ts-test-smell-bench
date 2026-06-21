it('should exclude files matching simple patterns', async () => {
        // Test the current implementation - this will fail until the bug is fixed
        const tree = await buildTreeForTesting(testDir, testDir, ['.env']);
        const fileNames = tree.map(entry => entry.name);
        
        expect(fileNames).not.toContain('.env');
        expect(fileNames).toContain('.env.local'); // Should not exclude this
        expect(fileNames).toContain('src');
        expect(fileNames).toContain('package.json');
    })