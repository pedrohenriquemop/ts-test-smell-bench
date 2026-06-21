it("should return Job not found for invalid job ID", async () => {
      const response = await request(TEST_URL).get(
        "/v0/crawl/status/invalidJobId",
      );
      expect(response.statusCode).toBe(404);
    })