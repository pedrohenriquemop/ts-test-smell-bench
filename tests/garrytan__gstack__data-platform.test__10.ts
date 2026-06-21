it('rejects absolute paths outside safe dirs', () => {
    expect(() => validateTempPath('/etc/passwd')).toThrow();
  })