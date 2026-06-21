it('should create default file', async () => {
      const tree = await buildTestingTree('config', 'single');
      expect(tree.files).toContain('/.puppeteerrc.mjs');
    })