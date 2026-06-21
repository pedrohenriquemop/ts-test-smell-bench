it('should resolve download URLs for devedition', () => {
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.LINUX, 'devedition_115.0b8'),
      'https://archive.mozilla.org/pub/devedition/releases/115.0b8/linux-x86_64/en-US/firefox-115.0b8.tar.bz2',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.MAC, 'devedition_115.0b8'),
      'https://archive.mozilla.org/pub/devedition/releases/115.0b8/mac/en-US/Firefox 115.0b8.dmg',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.MAC_ARM, 'devedition_115.0b8'),
      'https://archive.mozilla.org/pub/devedition/releases/115.0b8/mac/en-US/Firefox 115.0b8.dmg',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.WIN32, 'devedition_115.0b8'),
      'https://archive.mozilla.org/pub/devedition/releases/115.0b8/win32/en-US/Firefox Setup 115.0b8.exe',
    );
    assert.strictEqual(
      resolveDownloadUrl(BrowserPlatform.WIN64, 'devedition_115.0b8'),
      'https://archive.mozilla.org/pub/devedition/releases/115.0b8/win64/en-US/Firefox Setup 115.0b8.exe',
    );
  })