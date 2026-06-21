it('rejects non-existent files', () => {
    expect(() => validateTempPath('/tmp/nonexistent-file-12345.jpg')).toThrow(/not found/i);
  })