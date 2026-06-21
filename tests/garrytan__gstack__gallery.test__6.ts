test('HTML is self-contained (no external dependencies)', () => {
    const dir = path.join(tmpDir, 'self-contained');
    const session = path.join(dir, 'test-20260327');
    fs.mkdirSync(session, { recursive: true });
    createTestPng(path.join(session, 'variant-A.png'));

    const html = generateGalleryHtml(dir);
    // No external CSS/JS/image links
    expect(html).not.toContain('href="http');
    expect(html).not.toContain('src="http');
    expect(html).not.toContain('<link');
    // All images are base64
    expect(html).toContain('data:image/png;base64,');
  })