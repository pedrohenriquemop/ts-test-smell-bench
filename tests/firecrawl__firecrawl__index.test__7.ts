it("should not require authorization", async () => {
      const response = await request(TEST_URL).post("/v0/crawlWebsitePreview");
      expect(response.statusCode).not.toBe(401);
    })