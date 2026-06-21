it("should convert response body ArrayBuffer to byte array", async () => {
      const hoppFetch = createHoppFetchHook()

      const data = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {},
        data: data.buffer,
      })

      const response = await hoppFetch("https://api.example.com/data")

      expect((response as any)._bodyBytes).toEqual([72, 101, 108, 108, 111])
    })