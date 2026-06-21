it('handles CRLF line endings in file content', async () => {
        mockFs.readFile.mockResolvedValue('line1\r\nline2\r\nline3\r\n');
        
        const edits = [
          { oldText: 'line2', newText: 'modified line2' }
        ];
        
        mockFs.rename.mockResolvedValueOnce(undefined);
        
        await applyFileEdits('/test/file.txt', edits, false);
        
        expect(mockFs.writeFile).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
          'line1\nmodified line2\nline3\n',
          'utf-8'
        );
        expect(mockFs.rename).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.txt\.[a-f0-9]+\.tmp$/),
          '/test/file.txt'
        );
      })