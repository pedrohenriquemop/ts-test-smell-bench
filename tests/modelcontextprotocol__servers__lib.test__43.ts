it('handles files with leftover content', async () => {
        const mockFileHandle = {
          read: vi.fn(),
          close: vi.fn()
        } as any;
        
        // Simulate reading file content without final newline
        mockFileHandle.read
          .mockResolvedValueOnce({ bytesRead: 15, buffer: Buffer.from('line1\nline2\nend') })
          .mockResolvedValueOnce({ bytesRead: 0 });
        mockFileHandle.close.mockResolvedValue(undefined);
        
        mockFs.open.mockResolvedValue(mockFileHandle);
        
        const result = await headFile('/test/file.txt', 5);
        
        expect(mockFileHandle.close).toHaveBeenCalled();
      })