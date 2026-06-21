test('$B skill test hackernews-frontpage runs script.test.ts and reports pass', async () => {
    const result = await handleSkillCommand(['test', 'hackernews-frontpage'], { port: 0 });
    // bun test prints summary to stderr; handleSkillCommand returns stderr || stdout
    expect(result).toMatch(/13 pass|0 fail|tests passed/);
  }, 30_000)