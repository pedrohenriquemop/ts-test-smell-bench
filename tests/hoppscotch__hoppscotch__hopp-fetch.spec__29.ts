it("should throw error for non-Error exceptions", async () => {
      const hoppFetch = createHoppFetchHook()

      mockAxiosInstance.mockRejectedValue("String error")
      mockIsAxiosError.mockReturnValue(false)

      await expect(hoppFetch("https://api.example.com/data")).rejects.toThrow(
        "Fetch failed: Unknown error"
      )
    })