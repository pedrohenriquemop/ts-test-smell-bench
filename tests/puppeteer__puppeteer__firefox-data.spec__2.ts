it('should resolve download URLs for stable', () => {
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.LINUX, 'stable_111.0.1'),
      'https://archive.mozilla.org/pub/firefox/releases/111.0.1/linux-x86_64/en-US/firefox-111.0.1.tar.bz2',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.MAC, 'stable_111.0.1'),
      'https://archive.mozilla.org/pub/firefox/releases/111.0.1/mac/en-US/Firefox 111.0.1.dmg',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.MAC_ARM, 'stable_111.0.1'),
      'https://archive.mozilla.org/pub/firefox/releases/111.0.1/mac/en-US/Firefox 111.0.1.dmg',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.WIN32, 'stable_111.0.1'),
      'https://archive.mozilla.org/pub/firefox/releases/111.0.1/win32/en-US/Firefox Setup 111.0.1.exe',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.WIN64, 'stable_111.0.1'),
      'https://archive.mozilla.org/pub/firefox/releases/111.0.1/win64/en-US/Firefox Setup 111.0.1.exe',
    );
  })