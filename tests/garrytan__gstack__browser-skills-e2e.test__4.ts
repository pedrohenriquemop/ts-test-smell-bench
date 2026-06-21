test('$B skill show <missing> errors clearly', async () => {
    await expect(handleSkillCommand(['show', 'nonexistent-skill-xyz'], { port: 0 }))
      .rejects.toThrow(/not found in any tier/);
  })