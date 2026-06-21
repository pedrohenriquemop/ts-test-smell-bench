it('rejects paths in cwd', () => {
    // Create a real file in cwd to test the path check (not the existence check)
    const cwdFile = path.join(process.cwd(), 'package.json');
    expect(() => validateTempPath(cwdFile)).toThrow(/temp directory/i);
  })