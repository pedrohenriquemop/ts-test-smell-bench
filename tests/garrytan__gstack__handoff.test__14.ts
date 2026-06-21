test('handoff meta command joins args as message', async () => {
    const hbm = new BrowserManager();
    await hbm.launch();

    try {
      await handleWriteCommand('goto', [baseUrl + '/basic.html'], hbm);
      const result = await handleMetaCommand('handoff', ['CAPTCHA', 'stuck'], hbm, () => {});
      expect(result).toContain('CAPTCHA stuck');
    } finally {
      await hbm.close();
    }
  }, 45000)