it.concurrent("should return OK message", async () => {
      const response = await request(TEST_URL).get("/e2e-test");
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain("OK");
    })