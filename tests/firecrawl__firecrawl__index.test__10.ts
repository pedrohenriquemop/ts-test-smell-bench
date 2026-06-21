it("should require not authorization", async () => {
      const response = await request(TEST_URL).post("/v0/search");
      expect(response.statusCode).not.toBe(401);
    })