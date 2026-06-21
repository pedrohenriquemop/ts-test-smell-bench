test('handoff when already headed returns no-op', async () => {
    (bm as any).isHeaded = true;
    const result = await bm.handoff('test');
    expect(result).toContain('Already in headed mode');
    (bm as any).isHeaded = false;
  }, 10000)