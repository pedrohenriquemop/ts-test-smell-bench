import { describe, expect, it, vi, beforeEach } from "vitest"
import { createHoppFetchHook } from "../../utils/hopp-fetch"
import axios from "axios"

const mockAxios = axios as any
const mockIsAxiosError = mockAxios.isAxiosError as ReturnType<typeof vi.fn>
const mockAxiosInstance = vi.fn()

describe("CLI hopp-fetch", () => {
  beforeEach(() => {
      vi.clearAllMocks()

      // Set up axios.create to return our mockAxiosInstance
      mockAxios.create.mockReturnValue(mockAxiosInstance)

      // Default successful response
      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        data: new ArrayBuffer(0),
      })

      // Reset isAxiosError mock
      mockIsAxiosError.mockReturnValue(false)
    })

  describe("Response handling", () => {

    // ── TARGET TEST ─────────────────────────────────
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
    // ── END TARGET TEST ─────────────────────────────
  });
});