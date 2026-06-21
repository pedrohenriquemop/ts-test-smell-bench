it("should handle response body json conversion", async () => {
      const hoppFetch = createHoppFetchHook()

      const jsonData = { message: "success" }
      const data = new TextEncoder().encode(JSON.stringify(jsonData))
      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {},
        data: data.buffer,
      })

      const response = await hoppFetch("https://api.example.com/data")
      const json = await response.json()

      expect(json).toEqual(jsonData)
    })