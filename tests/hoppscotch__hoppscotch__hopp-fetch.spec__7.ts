it("should handle string URLs", async () => {
      const hoppFetch = createHoppFetchHook()

      await hoppFetch("https://api.example.com/data")

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/data",
          method: "GET",
        })
      )
    })