test('session without approved.json still renders', () => {
    const dir = path.join(tmpDir, 'no-approved');
    const session = path.join(dir, 'draft-20260327');
    fs.mkdirSync(session, { recursive: true });

    createTestPng(path.join(session, 'variant-A.png'));
    createTestPng(path.join(session, 'variant-B.png'));

    const html = generateGalleryHtml(dir);
    expect(html).toContain('draft');
    // No variant should be marked as approved
    expect(html).not.toContain('class="gallery-variant approved"');
  })