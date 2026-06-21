test('single session with approved variant', () => {
    const sessionDir = path.join(tmpDir, 'designs', 'homepage-20260327');
    fs.mkdirSync(sessionDir, { recursive: true });

    createTestPng(path.join(sessionDir, 'variant-A.png'));
    createTestPng(path.join(sessionDir, 'variant-B.png'));
    createTestPng(path.join(sessionDir, 'variant-C.png'));

    fs.writeFileSync(path.join(sessionDir, 'approved.json'), JSON.stringify({
      approved_variant: 'B',
      feedback: 'Great spacing and colors',
      date: '2026-03-27T12:00:00Z',
      screen: 'homepage',
    }));

    const html = generateGalleryHtml(path.join(tmpDir, 'designs'));
    expect(html).toContain('Design History');
    expect(html).toContain('1 exploration');
    expect(html).toContain('homepage');
    expect(html).toContain('2026-03-27');
    expect(html).toContain('approved');
    expect(html).toContain('Great spacing and colors');
    // Should have 3 variant images (base64)
    expect(html).toContain('data:image/png;base64,');
  })