test('full handoff: cookies preserved, headed mode active, commands work', async () => {
    const hbm = new BrowserManager();
    await hbm.launch();

    try {
      // Set up state
      await handleWriteCommand('goto', [baseUrl + '/basic.html'], hbm);
      await handleWriteCommand('cookie', ['handoff_test=preserved'], hbm);

      // Handoff
      const result = await hbm.handoff('Testing handoff');
      expect(result).toContain('HANDOFF:');
      expect(result).toContain('Testing handoff');
      expect(result).toContain('resume');
      expect(hbm.getIsHeaded()).toBe(true);

      // Verify cookies survived
      const { handleReadCommand } = await import('../src/read-commands');
      const cookiesResult = await handleReadCommand('cookies', [], hbm);
      expect(cookiesResult).toContain('handoff_test');

      // Verify commands still work
      const text = await handleReadCommand('text', [], hbm);
      expect(text.length).toBeGreaterThan(0);

      // Resume
      const resumeResult = await handleMetaCommand('resume', [], hbm, () => {});
      expect(resumeResult).toContain('RESUMED');
    } finally {
      await hbm.close();
    }
  }, 45000)