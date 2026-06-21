it('should resolve executable paths', () => {
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.LINUX, '111.0a1'),
      path.join('firefox', 'firefox'),
    );
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.MAC, '111.0a1'),
      path.join('Firefox Nightly.app', 'Contents', 'MacOS', 'firefox'),
    );
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.MAC_ARM, '111.0a1'),
      path.join('Firefox Nightly.app', 'Contents', 'MacOS', 'firefox'),
    );
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.MAC_ARM, 'stable_111.0.1'),
      path.join('Firefox.app', 'Contents', 'MacOS', 'firefox'),
    );
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.WIN32, '111.0a1'),
      path.join('firefox', 'firefox.exe'),
    );
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.WIN64, '111.0a1'),
      path.join('firefox', 'firefox.exe'),
    );
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.WIN32, 'beta_115.0b8'),
      path.join('core', 'firefox.exe'),
    );
    assert.strictEqual(
      relativeExecutablePath(BrowserPlatform.WIN64, 'beta_115.0b8'),
      path.join('core', 'firefox.exe'),
    );
  })