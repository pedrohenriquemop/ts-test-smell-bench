it("should extract method from Request object", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data", {
        method: "POST",
      })

      await hoppFetch(request)

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
        })
      )
    })