it('handles complex multi-line edits with indentation', async () => {
        mockFs.readFile.mockResolvedValue('function test() {\n  console.log("hello");\n  return true;\n}');
        
        const edits = [
          { 
            oldText: '  console.log("hello");\n  return true;', 
            newText: '  console.log("world");\n  console.log("test");\n  return false;' 
          }
        ];
        
        mockFs.rename.mockResolvedValueOnce(undefined);
        
        await applyFileEdits('/test/file.js', edits, false);
        
        expect(mockFs.writeFile).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.js\.[a-f0-9]+\.tmp$/),
          'function test() {\n  console.log("world");\n  console.log("test");\n  return false;\n}',
          'utf-8'
        );
        expect(mockFs.rename).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.js\.[a-f0-9]+\.tmp$/),
          '/test/file.js'
        );
      })