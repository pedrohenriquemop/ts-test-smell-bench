test('empty directory returns "No history" page', () => {
    const emptyDir = path.join(tmpDir, 'empty');
    fs.mkdirSync(emptyDir, { recursive: true });

    const html = generateGalleryHtml(emptyDir);
    expect(html).toContain('No design history yet');
    expect(html).toContain('/design-shotgun');
  })