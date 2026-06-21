it("should handle Request with no headers", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data")

      await hoppFetch(request)

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {},
        })
      )
    })