it("should return no error response with an invalid API key", async () => {
      const response = await request(TEST_URL)
        .post("/v0/search")
        .set("Authorization", `Bearer invalid-api-key`)
        .set("Content-Type", "application/json")
        .send({ query: "test" });
      expect(response.statusCode).not.toBe(401);
    })