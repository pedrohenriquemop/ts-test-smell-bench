it('writes file content', async () => {
        mockFs.writeFile.mockResolvedValueOnce(undefined);
        
        await writeFileContent('/test/file.txt', 'new content');
        
        expect(mockFs.writeFile).toHaveBeenCalledWith('/test/file.txt', 'new content', { encoding: "utf-8", flag: 'wx' });
      })