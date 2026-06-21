it('handles reaching requested line count', async () => {
        const mockFileHandle = {
          read: vi.fn(),
          close: vi.fn()
        } as any;
        
        // Simulate reading exactly the requested number of lines
        mockFileHandle.read
          .mockResolvedValueOnce({ bytesRead: 12, buffer: Buffer.from('line1\nline2\n') })
          .mockResolvedValueOnce({ bytesRead: 0 });
        mockFileHandle.close.mockResolvedValue(undefined);
        
        mockFs.open.mockResolvedValue(mockFileHandle);
        
        const result = await headFile('/test/file.txt', 2);
        
        expect(mockFileHandle.close).toHaveBeenCalled();
      })