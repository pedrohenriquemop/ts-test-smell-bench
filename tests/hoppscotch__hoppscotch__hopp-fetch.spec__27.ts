it("should handle axios error with response", async () => {
      const hoppFetch = createHoppFetchHook()

      const errorResponse = {
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        data: new ArrayBuffer(0),
      }

      mockAxiosInstance.mockRejectedValue({
        response: errorResponse,
        isAxiosError: true,
      })
      mockIsAxiosError.mockReturnValue(true)

      const response = await hoppFetch("https://api.example.com/data")

      expect(response.status).toBe(500)
      expect(response.statusText).toBe("Internal Server Error")
    })