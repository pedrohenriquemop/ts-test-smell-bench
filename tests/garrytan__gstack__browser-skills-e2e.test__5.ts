test('$B skill help prints usage', async () => {
    const result = await handleSkillCommand([], { port: 0 });
    expect(result).toContain('Usage');
    expect(result).toContain('list');
    expect(result).toContain('show');
    expect(result).toContain('run');
  })