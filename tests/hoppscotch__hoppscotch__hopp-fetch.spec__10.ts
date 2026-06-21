it("should default to GET when no method specified", async () => {
      const hoppFetch = createHoppFetchHook()

      await hoppFetch("https://api.example.com/data")

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
        })
      )
    })