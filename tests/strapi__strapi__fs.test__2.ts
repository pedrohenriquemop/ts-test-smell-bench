test('Normalize the path to avoid relative access to folders in parent directories', async () => {
      const strapiFS = fs(strapi);

      const content = '';

      await strapiFS.writeAppFile('../../test', content);

      expect(fse.ensureFile).toHaveBeenCalledWith(path.join('/', 'tmp', 'test'));
      expect(fse.writeFile).toHaveBeenCalledWith(path.join('/', 'tmp', 'test'), content);
    })