it('should handle dot files correctly', async () => {
        const tree = await buildTreeForTesting(testDir, testDir, ['.git']);
        const dirNames = tree.map(entry => entry.name);
        
        expect(dirNames).not.toContain('.git');
        expect(dirNames).toContain('.env'); // Should not exclude this
    })