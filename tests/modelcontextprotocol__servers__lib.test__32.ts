it('handles whitespace-flexible matching', async () => {
        mockFs.readFile.mockResolvedValue('  line1\n    line2\n  line3\n');
        
        const edits = [
          { oldText: 'line2', newText: 'modified line2' }
        ];
        
        mockFs.rename.mockResolvedValueOnce(undefined);
        
        await applyFileEdits('/test/file.txt', edits, false);
        
        expect(mockFs.writeFile).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
          '  line1\n    modified line2\n  line3\n',
          'utf-8'
        );
        expect(mockFs.rename).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
          '/test/file.txt'
        );
      })