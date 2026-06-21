it("POST /v1/llmstxt enqueues with Deprecation header and warnings in body", async () => {
    const res = await request(TEST_API_URL)
      .post("/v1/llmstxt")
      .set("Authorization", `Bearer ${identity.apiKey}`)
      .set("Content-Type", "application/json")
      .send({ url: "https://firecrawl.dev" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers["deprecation"]).toBe("true");
    expect(res.headers["warning"]).toMatch(/^299 - "/);
    expect(res.headers["warning"]).toMatch(/llmstxt/i);
    expect(Array.isArray(res.body.warnings)).toBe(true);
    expect(res.body.warnings.some((w: string) => /llmstxt/i.test(w))).toBe(
      true,
    );
    expect(res.body.warnings.some((w: string) => /deprecated/i.test(w))).toBe(
      true,
    );
    expect(res.body.replacement).toBeUndefined();
    expect(res.headers["link"]).toBeUndefined();
  }, 30000)