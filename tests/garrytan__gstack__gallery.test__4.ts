test('corrupted approved.json is handled gracefully', () => {
    const dir = path.join(tmpDir, 'corrupt');
    const session = path.join(dir, 'broken-20260327');
    fs.mkdirSync(session, { recursive: true });

    createTestPng(path.join(session, 'variant-A.png'));
    fs.writeFileSync(path.join(session, 'approved.json'), 'NOT VALID JSON {{{');

    const html = generateGalleryHtml(dir);
    // Should still render the session, just without any variant marked as approved
    expect(html).toContain('Design History');
    expect(html).toContain('broken');
    // The class "approved" should not appear on any variant div (only in CSS definition)
    expect(html).not.toContain('class="gallery-variant approved"');
  })