test('$B skill rm cannot tombstone bundled tier (read-only)', async () => {
    // The bundled hackernews-frontpage skill is shipped read-only; rm targets
    // user tiers (project default, --global). Attempting rm on a name that
    // only exists in bundled should error with "not found".
    await expect(handleSkillCommand(['rm', 'hackernews-frontpage', '--global'], { port: 0 }))
      .rejects.toThrow(/not found/);
  })