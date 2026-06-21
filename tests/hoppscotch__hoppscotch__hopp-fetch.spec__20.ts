it("should set ok to false for non-2xx status codes", async () => {
      const hoppFetch = createHoppFetchHook()

      mockAxiosInstance.mockResolvedValue({
        status: 404,
        statusText: "Not Found",
        headers: {},
        data: new ArrayBuffer(0),
      })

      const response = await hoppFetch("https://api.example.com/data")

      expect(response.ok).toBe(false)
    })