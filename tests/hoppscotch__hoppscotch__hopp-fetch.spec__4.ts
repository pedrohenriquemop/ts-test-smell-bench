it("should prefer init headers over Request headers", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data", {
        headers: { "X-Custom": "from-request" },
      })

      // Init overrides Request headers
      await hoppFetch(request, {
        headers: { "X-Custom": "from-init" },
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-Custom": "from-init",
          }),
        })
      )
    })