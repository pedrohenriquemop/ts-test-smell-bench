test('Provides new functions', () => {
    const strapiFS = fs(strapi);

    expect(strapiFS.writeAppFile).toBeInstanceOf(Function);
    expect(strapiFS.writePluginFile).toBeInstanceOf(Function);
  })