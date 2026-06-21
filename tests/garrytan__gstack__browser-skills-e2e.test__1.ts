test('listBrowserSkills() returns hackernews-frontpage at bundled tier', () => {
    const skills = listBrowserSkills();
    const hn = skills.find(s => s.name === 'hackernews-frontpage');
    expect(hn).toBeTruthy();
    expect(hn!.tier).toBe('bundled');
    expect(hn!.frontmatter.host).toBe('news.ycombinator.com');
    expect(hn!.frontmatter.trusted).toBe(true);
    expect(hn!.frontmatter.triggers).toContain('scrape hn frontpage');
  })