test('multiple sessions sorted by date (newest first)', () => {
    const dir = path.join(tmpDir, 'multi');
    const session1 = path.join(dir, 'settings-20260301');
    const session2 = path.join(dir, 'dashboard-20260315');
    fs.mkdirSync(session1, { recursive: true });
    fs.mkdirSync(session2, { recursive: true });

    createTestPng(path.join(session1, 'variant-A.png'));
    createTestPng(path.join(session2, 'variant-A.png'));

    fs.writeFileSync(path.join(session1, 'approved.json'), JSON.stringify({
      approved_variant: 'A', date: '2026-03-01T12:00:00Z',
    }));
    fs.writeFileSync(path.join(session2, 'approved.json'), JSON.stringify({
      approved_variant: 'A', date: '2026-03-15T12:00:00Z',
    }));

    const html = generateGalleryHtml(dir);
    expect(html).toContain('2 explorations');
    // Dashboard (Mar 15) should appear before settings (Mar 1)
    const dashIdx = html.indexOf('dashboard');
    const settingsIdx = html.indexOf('settings');
    expect(dashIdx).toBeLessThan(settingsIdx);
  })