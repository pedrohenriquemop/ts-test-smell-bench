test('captures multiple tabs', async () => {
    while (bm.getTabCount() > 1) {
      await bm.closeTab();
    }
    await handleWriteCommand('goto', [baseUrl + '/basic.html'], bm);
    await handleMetaCommand('newtab', [baseUrl + '/form.html'], bm, () => {});

    const state = await bm.saveState();
    expect(state.pages.length).toBe(2);
    const activePage = state.pages.find(p => p.isActive);
    expect(activePage).toBeDefined();
    expect(activePage!.url).toContain('/form.html');

    await bm.closeTab();
  }, 15000)