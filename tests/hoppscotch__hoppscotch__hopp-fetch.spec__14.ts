it("should handle Blob body", async () => {
      const hoppFetch = createHoppFetchHook()

      const blob = new Blob(["test data"], { type: "text/plain" })

      await hoppFetch("https://api.example.com/data", {
        method: "POST",
        body: blob,
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          data: blob,
        })
      )
    })