it("should return a successful response without a valid API key", async () => {
      const response = await request(TEST_URL)
        .post("/v0/search")
        .set("Content-Type", "application/json")
        .send({ query: "test" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("data");
    }, 20000)