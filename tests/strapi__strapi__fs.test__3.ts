test('Works with array path', async () => {
      const strapiFS = fs(strapi);

      const content = '';

      await strapiFS.writeAppFile(['test', 'sub', 'path'], content);

      expect(fse.ensureFile).toHaveBeenCalledWith(path.join('/', 'tmp', 'test', 'sub', 'path'));
      expect(fse.writeFile).toHaveBeenCalledWith(
        path.join('/', 'tmp', 'test', 'sub', 'path'),
        content
      );
    })