it('rejects when parent directory does not exist', async () => {
        const newFilePath = process.platform === 'win32' ? 'C:\\Users\\test\\nonexistent\\newfile.txt' : '/home/user/nonexistent/newfile.txt';
        
        // Create errors with the ENOENT code
        const enoentError1 = new Error('ENOENT') as NodeJS.ErrnoException;
        enoentError1.code = 'ENOENT';
        const enoentError2 = new Error('ENOENT') as NodeJS.ErrnoException;
        enoentError2.code = 'ENOENT';
        
        mockFs.realpath
          .mockRejectedValueOnce(enoentError1)
          .mockRejectedValueOnce(enoentError2);
        
        await expect(validatePath(newFilePath))
          .rejects.toThrow('Parent directory does not exist');
      })