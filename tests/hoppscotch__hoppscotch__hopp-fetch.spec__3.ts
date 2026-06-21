it("should prefer init options over Request properties (method)", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data", {
        method: "POST",
      })

      // Init overrides Request method
      await hoppFetch(request, { method: "PUT" })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PUT",
        })
      )
    })