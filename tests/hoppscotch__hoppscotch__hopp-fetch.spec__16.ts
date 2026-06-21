it("should convert Headers object to plain object", async () => {
      const hoppFetch = createHoppFetchHook()

      const headers = new Headers({
        "X-Custom": "value",
        "Content-Type": "application/json",
      })

      await hoppFetch("https://api.example.com/data", {
        headers,
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-custom": "value",
            "content-type": "application/json",
          }),
        })
      )
    })