it("should handle URL objects", async () => {
      const hoppFetch = createHoppFetchHook()

      const url = new URL("https://api.example.com/data")
      await hoppFetch(url)

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/data",
        })
      )
    })