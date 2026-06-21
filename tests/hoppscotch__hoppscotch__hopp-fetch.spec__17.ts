it("should convert headers array to plain object", async () => {
      const hoppFetch = createHoppFetchHook()

      const headers: [string, string][] = [
        ["X-Custom", "value"],
        ["Content-Type", "application/json"],
      ]

      await hoppFetch("https://api.example.com/data", {
        headers,
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-Custom": "value",
            "Content-Type": "application/json",
          }),
        })
      )
    })