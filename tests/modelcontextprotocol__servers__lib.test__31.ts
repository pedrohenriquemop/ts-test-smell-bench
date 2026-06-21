it('applies multiple edits sequentially', async () => {
        const edits = [
          { oldText: 'line1', newText: 'first line' },
          { oldText: 'line3', newText: 'third line' }
        ];
        
        mockFs.rename.mockResolvedValueOnce(undefined);
        
        await applyFileEdits('/test/file.txt', edits, false);
        
        expect(mockFs.writeFile).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
          'first line\nline2\nthird line\n',
          'utf-8'
        );
        expect(mockFs.rename).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
          '/test/file.txt'
        );
      })