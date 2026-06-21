test('resume without prior handoff works via meta command', async () => {
    await handleWriteCommand('goto', [baseUrl + '/basic.html'], bm);
    const result = await handleMetaCommand('resume', [], bm, () => {});
    expect(result).toContain('RESUMED');
  }, 15000)