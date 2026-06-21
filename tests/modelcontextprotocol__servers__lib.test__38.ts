it('calls stat to check file size', async () => {
        mockFs.stat.mockResolvedValue({ size: 100 } as any);
        
        // Mock file handle with proper typing
        const mockFileHandle = {
          read: vi.fn(),
          close: vi.fn()
        } as any;
        
        mockFileHandle.read.mockResolvedValue({ bytesRead: 0 });
        mockFileHandle.close.mockResolvedValue(undefined);
        
        mockFs.open.mockResolvedValue(mockFileHandle);
        
        await tailFile('/test/file.txt', 2);
        
        expect(mockFs.stat).toHaveBeenCalledWith('/test/file.txt');
        expect(mockFs.open).toHaveBeenCalledWith('/test/file.txt', 'r');
      })