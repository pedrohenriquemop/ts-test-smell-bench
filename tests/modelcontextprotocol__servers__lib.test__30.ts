it('handles dry run mode', async () => {
        const edits = [
          { oldText: 'line2', newText: 'modified line2' }
        ];
        
        const result = await applyFileEdits('/test/file.txt', edits, true);
        
        expect(result).toContain('modified line2');
        expect(mockFs.writeFile).not.toHaveBeenCalled();
      })