it("should extract headers from Request object", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data", {
        headers: {
          "X-Custom-Header": "test-value",
          Authorization: "Bearer token123",
        },
      })

      await hoppFetch(request)

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-custom-header": "test-value",
            authorization: "Bearer token123",
          }),
        })
      )
    })