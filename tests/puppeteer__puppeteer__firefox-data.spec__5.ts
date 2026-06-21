it('should create a profile', async () => {
      await createProfile({
        preferences: {
          test: 1,
        },
        path: tmpDir,
      });
      const text = fs.readFileSync(path.join(tmpDir, 'user.js'), 'utf-8');
      assert.ok(
        text.includes(`user_pref("toolkit.startup.max_resumed_crashes", -1);`),
      ); // default preference.
      assert.ok(text.includes(`user_pref("test", 1);`)); // custom preference.
    })