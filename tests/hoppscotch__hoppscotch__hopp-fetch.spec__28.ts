it("should throw error for network failure without response", async () => {
      const hoppFetch = createHoppFetchHook()

      const networkError = new Error("Network Error")
      mockAxiosInstance.mockRejectedValue(networkError)
      mockIsAxiosError.mockReturnValue(false)

      await expect(hoppFetch("https://api.example.com/data")).rejects.toThrow(
        "Fetch failed: Network Error"
      )
    })