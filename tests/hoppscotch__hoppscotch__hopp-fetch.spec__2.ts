it("should extract body from Request object", async () => {
      const hoppFetch = createHoppFetchHook()

      const request = new Request("https://api.example.com/data", {
        method: "POST",
        body: JSON.stringify({ key: "value" }),
      })

      await hoppFetch(request)

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(ArrayBuffer), // Body is converted to ArrayBuffer
        })
      )
    })