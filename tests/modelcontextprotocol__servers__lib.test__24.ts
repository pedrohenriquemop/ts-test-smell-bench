it('reads file with custom encoding', async () => {
        mockFs.readFile.mockResolvedValueOnce('file content');
        
        const result = await readFileContent('/test/file.txt', 'ascii');
        
        expect(result).toBe('file content');
        expect(mockFs.readFile).toHaveBeenCalledWith('/test/file.txt', 'ascii');
      })