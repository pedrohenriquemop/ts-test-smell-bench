it("should not require authorization", async () => {
      const response = await request(TEST_URL).post("/v0/scrape");
      expect(response.statusCode).not.toBe(401);
    })