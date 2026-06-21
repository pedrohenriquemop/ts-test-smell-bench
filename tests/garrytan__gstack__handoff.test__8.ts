test('state survives recreateContext round-trip', async () => {
    await handleWriteCommand('goto', [baseUrl + '/basic.html'], bm);
    await handleWriteCommand('cookie', ['restored=yes'], bm);

    const stateBefore = await bm.saveState();
    expect(stateBefore.cookies.some(c => c.name === 'restored')).toBe(true);

    await bm.recreateContext();

    const stateAfter = await bm.saveState();
    expect(stateAfter.cookies.some(c => c.name === 'restored')).toBe(true);
    expect(stateAfter.pages.length).toBeGreaterThanOrEqual(1);
  }, 30000)