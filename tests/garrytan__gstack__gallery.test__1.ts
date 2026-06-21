test('nonexistent directory returns "No history" page', () => {
    const html = generateGalleryHtml('/nonexistent/path');
    expect(html).toContain('No design history yet');
  })