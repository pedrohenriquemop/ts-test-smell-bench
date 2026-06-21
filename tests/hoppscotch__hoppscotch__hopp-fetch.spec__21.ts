it("should convert response headers to serializable format", async () => {
      const hoppFetch = createHoppFetchHook()

      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "x-custom-header": "value",
        },
        data: new ArrayBuffer(0),
      })

      const response = await hoppFetch("https://api.example.com/data")

      expect(response.headers.get("content-type")).toBe("application/json")
      expect(response.headers.get("x-custom-header")).toBe("value")
    })