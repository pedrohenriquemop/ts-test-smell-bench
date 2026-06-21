it('handles files with content and returns last lines', async () => {
        mockFs.stat.mockResolvedValue({ size: 50 } as any);
        
        const mockFileHandle = {
          read: vi.fn(),
          close: vi.fn()
        } as any;
        
        // Simulate reading file content in chunks
        mockFileHandle.read
          .mockResolvedValueOnce({ bytesRead: 20, buffer: Buffer.from('line3\nline4\nline5\n') })
          .mockResolvedValueOnce({ bytesRead: 0 });
        mockFileHandle.close.mockResolvedValue(undefined);
        
        mockFs.open.mockResolvedValue(mockFileHandle);
        
        const result = await tailFile('/test/file.txt', 2);
        
        expect(mockFileHandle.close).toHaveBeenCalled();
      })