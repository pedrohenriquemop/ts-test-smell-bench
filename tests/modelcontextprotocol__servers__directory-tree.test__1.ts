it('should exclude directories matching simple patterns', async () => {
        const tree = await buildTreeForTesting(testDir, testDir, ['node_modules']);
        const dirNames = tree.map(entry => entry.name);
        
        expect(dirNames).not.toContain('node_modules');
        expect(dirNames).toContain('src');
        expect(dirNames).toContain('.git');
    })