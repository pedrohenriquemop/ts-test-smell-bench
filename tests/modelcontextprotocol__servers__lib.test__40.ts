it('handles read errors gracefully', async () => {
        mockFs.stat.mockResolvedValue({ size: 100 } as any);
        
        const mockFileHandle = {
          read: vi.fn(),
          close: vi.fn()
        } as any;
        
        mockFileHandle.read.mockResolvedValue({ bytesRead: 0 });
        mockFileHandle.close.mockResolvedValue(undefined);
        
        mockFs.open.mockResolvedValue(mockFileHandle);
        
        await tailFile('/test/file.txt', 5);
        
        expect(mockFileHandle.close).toHaveBeenCalled();
      })