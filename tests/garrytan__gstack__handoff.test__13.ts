test('multi-tab handoff preserves all tabs', async () => {
    const hbm = new BrowserManager();
    await hbm.launch();

    try {
      await handleWriteCommand('goto', [baseUrl + '/basic.html'], hbm);
      await handleMetaCommand('newtab', [baseUrl + '/form.html'], hbm, () => {});
      expect(hbm.getTabCount()).toBe(2);

      await hbm.handoff('multi-tab test');
      expect(hbm.getTabCount()).toBe(2);
      expect(hbm.getIsHeaded()).toBe(true);
    } finally {
      await hbm.close();
    }
  }, 45000)