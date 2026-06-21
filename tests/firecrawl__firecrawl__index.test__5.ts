it("should return an error for a unsupported URL", async () => {
      const unsupportedUrl = "https://twitter.com/fake-test";
      const response = await request(TEST_URL)
        .post("/v0/crawl")
        .set("Content-Type", "application/json")
        .send({ url: unsupportedUrl });
      expect(response.statusCode).toBe(403);
      expect(response.body.error).toContain(UNSUPPORTED_SITE_MESSAGE);
    })