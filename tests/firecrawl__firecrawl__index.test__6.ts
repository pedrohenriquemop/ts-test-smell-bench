it("should return a successful response", async () => {
      const response = await request(TEST_URL)
        .post("/v0/crawl")
        .set("Content-Type", "application/json")
        .send({ url: "https://firecrawl.dev" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("jobId");
      expect(response.body.jobId).toMatch(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      );
    })