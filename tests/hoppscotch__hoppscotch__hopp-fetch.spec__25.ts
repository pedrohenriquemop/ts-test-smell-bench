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
    it("should handle response body text conversion", async () => {
          const hoppFetch = createHoppFetchHook()

          const data = new TextEncoder().encode("Hello World")
          mockAxiosInstance.mockResolvedValue({
            status: 200,
            statusText: "OK",
            headers: {},
            data: data.buffer,
          })

          const response = await hoppFetch("https://api.example.com/data")
          const text = await response.text()

          expect(text).toBe("Hello World")
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});