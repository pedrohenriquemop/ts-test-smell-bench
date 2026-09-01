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
    it("should convert response headers to serializable format", async () => {
          const hoppFetch = createHoppFetchHook()

          mockAxiosInstance.mockResolvedValue({
            status: 200,
            statusText: "OK",
            headers: {
              "content-type": "application/json",
              "x-custom-header": "value",
            },
            data: new ArrayBuffer(0),
          })

          const response = await hoppFetch("https://api.example.com/data")

          expect(response.headers.get("content-type")).toBe("application/json")
          expect(response.headers.get("x-custom-header")).toBe("value")
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});