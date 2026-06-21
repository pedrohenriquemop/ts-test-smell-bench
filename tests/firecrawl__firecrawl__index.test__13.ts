it("should not require authorization", async () => {
      const response = await request(TEST_URL).get("/v0/crawl/status/123");
      expect(response.statusCode).not.toBe(401);
    })