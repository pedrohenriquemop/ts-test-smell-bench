it("GET /v1/llmstxt/:jobId still emits warnings on 404", async () => {
    const res = await request(TEST_API_URL)
      .get(`/v1/llmstxt/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${identity.apiKey}`);

    expect(res.statusCode).toBe(404);
    expect(res.headers["deprecation"]).toBe("true");
    expect(res.headers["warning"]).toMatch(/deprecated/i);
    expect(Array.isArray(res.body.warnings)).toBe(true);
    expect(res.body.warnings.some((w: string) => /deprecated/i.test(w))).toBe(
      true,
    );
  }, 30000)