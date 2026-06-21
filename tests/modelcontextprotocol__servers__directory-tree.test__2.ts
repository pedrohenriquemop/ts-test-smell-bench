it('should exclude nested directories with same pattern', async () => {
        const tree = await buildTreeForTesting(testDir, testDir, ['node_modules']);
        
        // Find the nested directory
        const nestedDir = tree.find(entry => entry.name === 'nested');
        expect(nestedDir).toBeDefined();
        expect(nestedDir!.children).toBeDefined();
        
        // The nested/node_modules should also be excluded
        const nestedChildren = nestedDir!.children!.map(child => child.name);
        expect(nestedChildren).not.toContain('node_modules');
    })