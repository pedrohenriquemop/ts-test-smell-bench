it('should create default file', async () => {
      const tree = await buildTestingTree('config', 'multi');
      expect(tree.files).toContain('/.puppeteerrc.mjs');
      expect(tree.files).not.toContain(
        getMultiApplicationFile('.puppeteerrc.mjs'),
      );
    })