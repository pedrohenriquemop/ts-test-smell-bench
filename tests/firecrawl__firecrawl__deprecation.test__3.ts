it("non-deprecated endpoints do not emit Deprecation header or warnings", async () => {
    const res = await request(TEST_API_URL)
      .post("/v1/scrape")
      .set("Authorization", `Bearer ${identity.apiKey}`)
      .set("Content-Type", "application/json")
      .send({ url: "https://firecrawl.dev" });

    expect(res.headers["deprecation"]).toBeUndefined();
    expect(res.headers["warning"]).toBeUndefined();
    if (res.body && typeof res.body === "object") {
      expect(res.body.warnings).toBeUndefined();
      expect(res.body.replacement).toBeUndefined();
    }
  }, 60000)