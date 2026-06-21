it('handles custom filename', () => {
        const diff = createUnifiedDiff('old', 'new', 'custom.txt');
        expect(diff).toContain('--- custom.txt');
        expect(diff).toContain('+++ custom.txt');
      })