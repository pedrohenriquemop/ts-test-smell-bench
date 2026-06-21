it('should download and unpack the binary', async function () {
    this.timeout(60000);
    const expectedOutputPath = path.join(
      tmpDir,
      'chromedriver',
      `${BrowserPlatform.LINUX}-${testChromeDriverBuildId}`,
    );
    assert.strictEqual(fs.existsSync(expectedOutputPath), false);
    let browser = await install({
      cacheDir: tmpDir,
      browser: Browser.CHROMEDRIVER,
      platform: BrowserPlatform.LINUX,
      buildId: testChromeDriverBuildId,
      baseUrl: getServerUrl(),
    });
    assert.strictEqual(browser.path, expectedOutputPath);
    assert.ok(fs.existsSync(expectedOutputPath));
    // Second iteration should be no-op.
    browser = await install({
      cacheDir: tmpDir,
      browser: Browser.CHROMEDRIVER,
      platform: BrowserPlatform.LINUX,
      buildId: testChromeDriverBuildId,
      baseUrl: getServerUrl(),
    });
    assert.strictEqual(browser.path, expectedOutputPath);
    assert.ok(fs.existsSync(expectedOutputPath));
    assert.ok(fs.existsSync(browser.executablePath));
  })