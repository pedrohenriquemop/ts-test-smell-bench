it("should return a successful response for a valid crawl job", async () => {
      const crawlResponse = await request(TEST_URL)
        .post("/v0/crawl")
        .set("Content-Type", "application/json")
        .send({ url: "https://firecrawl.dev" });
      expect(crawlResponse.statusCode).toBe(200);

      const response = await request(TEST_URL).get(
        `/v0/crawl/status/${crawlResponse.body.jobId}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("active");

      // wait for 30 seconds
      await new Promise(r => setTimeout(r, 30000));

      const completedResponse = await request(TEST_URL).get(
        `/v0/crawl/status/${crawlResponse.body.jobId}`,
      );
      expect(completedResponse.statusCode).toBe(200);
      expect(completedResponse.body).toHaveProperty("status");
      expect(completedResponse.body.status).toBe("completed");
      expect(completedResponse.body).toHaveProperty("data");
      expect(completedResponse.body.data[0]).toHaveProperty("content");
      expect(completedResponse.body.data[0]).toHaveProperty("markdown");
      expect(completedResponse.body.data[0]).toHaveProperty("metadata");
    }, 60000)