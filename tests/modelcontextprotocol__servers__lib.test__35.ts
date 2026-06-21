it('handles edits with different indentation patterns', async () => {
        mockFs.readFile.mockResolvedValue('    if (condition) {\n        doSomething();\n    }');
        
        const edits = [
          { 
            oldText: 'doSomething();', 
            newText: 'doSomethingElse();\n        doAnotherThing();' 
          }
        ];
        
        mockFs.rename.mockResolvedValueOnce(undefined);
        
        await applyFileEdits('/test/file.js', edits, false);
        
        expect(mockFs.writeFile).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.js\.[a-f0-9]+\.tmp$/),
          '    if (condition) {\n        doSomethingElse();\n        doAnotherThing();\n    }',
          'utf-8'
        );
        expect(mockFs.rename).toHaveBeenCalledWith(
          expect.stringMatching(/\/test\/file\.js\.[a-f0-9]+\.tmp$/),
          '/test/file.js'
        );
      })