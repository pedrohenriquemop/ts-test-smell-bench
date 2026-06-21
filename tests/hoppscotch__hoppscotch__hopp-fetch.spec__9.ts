it("should handle init options with string URL", async () => {
      const hoppFetch = createHoppFetchHook()

      await hoppFetch("https://api.example.com/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/data",
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          data: JSON.stringify({ test: true }),
        })
      )
    })