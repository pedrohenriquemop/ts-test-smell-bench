test('$B skill show hackernews-frontpage prints the SKILL.md', async () => {
    const result = await handleSkillCommand(['show', 'hackernews-frontpage'], { port: 0 });
    expect(result).toContain('host: news.ycombinator.com');
    expect(result).toContain('trusted: true');
    expect(result).toContain('Hacker News front-page scraper');
    expect(result).toContain('triggers:');
  })