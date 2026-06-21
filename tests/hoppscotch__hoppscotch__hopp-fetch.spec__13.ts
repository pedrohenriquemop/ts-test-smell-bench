it("should handle FormData body", async () => {
      const hoppFetch = createHoppFetchHook()

      const formData = new FormData()
      formData.append("key", "value")

      await hoppFetch("https://api.example.com/data", {
        method: "POST",
        body: formData,
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          data: formData,
        })
      )
    })