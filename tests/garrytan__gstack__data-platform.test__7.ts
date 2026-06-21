it('allows paths within /tmp that exist', () => {
    tmpFile = path.join(TEMP_DIR, `test-temp-path-${Date.now()}.jpg`);
    fs.writeFileSync(tmpFile, 'test');
    try {
      expect(() => validateTempPath(tmpFile)).not.toThrow();
    } finally {
      fs.unlinkSync(tmpFile);
    }
  })