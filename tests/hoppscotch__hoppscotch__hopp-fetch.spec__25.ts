it("should handle response body text conversion", async () => {
      const hoppFetch = createHoppFetchHook()

      const data = new TextEncoder().encode("Hello World")
      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {},
        data: data.buffer,
      })

      const response = await hoppFetch("https://api.example.com/data")
      const text = await response.text()

      expect(text).toBe("Hello World")
    })