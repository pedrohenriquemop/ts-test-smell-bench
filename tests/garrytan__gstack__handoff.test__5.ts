test('captures cookies and page URLs', async () => {
    await handleWriteCommand('goto', [baseUrl + '/basic.html'], bm);
    await handleWriteCommand('cookie', ['testcookie=testvalue'], bm);

    const state = await bm.saveState();

    expect(state.cookies.length).toBeGreaterThan(0);
    expect(state.cookies.some(c => c.name === 'testcookie')).toBe(true);
    expect(state.pages.length).toBeGreaterThanOrEqual(1);
    expect(state.pages.some(p => p.url.includes('/basic.html'))).toBe(true);
  }, 15000)