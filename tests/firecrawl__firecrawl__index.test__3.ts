it("should return a successful response", async () => {
      const response = await request(TEST_URL)
        .post("/v0/scrape")
        .set("Content-Type", "application/json")
        .send({ url: "https://firecrawl.dev" });
      expect(response.statusCode).toBe(200);
    }, 10000)