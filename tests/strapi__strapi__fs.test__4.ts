test('Scopes the writes in the extensions folder', async () => {
      const strapiFS = fs(strapi);

      const content = '';

      strapiFS.writeAppFile = jest.fn(() => Promise.resolve());

      await strapiFS.writePluginFile('users-permissions', ['test', 'sub', 'path'], content);

      expect(strapiFS.writeAppFile).toHaveBeenCalledWith(
        'extensions/users-permissions/test/sub/path',
        content
      );
    })