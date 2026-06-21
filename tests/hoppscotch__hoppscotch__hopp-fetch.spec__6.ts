it("should extract all properties from Request object", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "secret",
        },
        body: JSON.stringify({ update: true }),
      })

      await hoppFetch(request)

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/data",
          method: "PATCH",
          headers: expect.objectContaining({
            "content-type": "application/json",
            "x-api-key": "secret",
          }),
          data: expect.any(ArrayBuffer),
        })
      )
    })