it("should set ok to true for 2xx status codes", async () => {
      const hoppFetch = createHoppFetchHook()

      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {},
        data: new ArrayBuffer(0),
      })

      const response = await hoppFetch("https://api.example.com/data")

      expect(response.ok).toBe(true)
    })