it("should handle ArrayBuffer body", async () => {
      const hoppFetch = createHoppFetchHook()

      const buffer = new ArrayBuffer(8)

      await hoppFetch("https://api.example.com/data", {
        method: "POST",
        body: buffer,
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          data: buffer,
        })
      )
    })