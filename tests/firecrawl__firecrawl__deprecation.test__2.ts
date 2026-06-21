it("POST /v1/deep-research returns warnings and successor-version Link", async () => {
    const res = await request(TEST_API_URL)
      .post("/v1/deep-research")
      .set("Authorization", `Bearer ${identity.apiKey}`)
      .set("Content-Type", "application/json")
      .send({
        query: "what is firecrawl",
        maxDepth: 1,
        maxUrls: 1,
        timeLimit: 60,
      });

    expect(res.statusCode).toBe(200);
    expect(res.headers["deprecation"]).toBe("true");
    expect(res.headers["warning"]).toMatch(/deep-research/i);
    expect(res.headers["link"]).toContain(
      '</v2/search>; rel="successor-version"',
    );
    expect(Array.isArray(res.body.warnings)).toBe(true);
    expect(
      res.body.warnings.some((w: string) => /deep-research/i.test(w)),
    ).toBe(true);
    expect(res.body.replacement).toBe("/v2/search");
  }, 30000)