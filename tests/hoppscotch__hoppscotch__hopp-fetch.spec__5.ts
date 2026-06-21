it("should merge Request headers with init headers", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data", {
        headers: { "X-Request-Header": "value1" },
      })

      await hoppFetch(request, {
        headers: { "X-Init-Header": "value2" },
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-request-header": "value1",
            "X-Init-Header": "value2",
          }),
        })
      )
    })