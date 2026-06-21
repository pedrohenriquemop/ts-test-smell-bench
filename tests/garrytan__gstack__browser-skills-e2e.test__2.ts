test('$B skill list dispatches and includes hackernews-frontpage', async () => {
    const result = await handleSkillCommand(['list'], { port: 0 });
    expect(result).toContain('hackernews-frontpage');
    expect(result).toContain('bundled');
    expect(result).toContain('news.ycombinator.com');
  })