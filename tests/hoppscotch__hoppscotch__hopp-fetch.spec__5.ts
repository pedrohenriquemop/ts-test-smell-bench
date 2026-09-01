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

  describe("Request object property extraction", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("should merge Request headers with init headers", async () => {
          const hoppFetch = createHoppFetchHook()

          const request = new Request("https://api.example.com/data", {
            headers: { "X-Request-Header": "value1" },
          })

          await hoppFetch(request, {
            headers: { "X-Init-Header": "value2" },
          })

          expect(mockAxiosInstance).toHaveBeenCalledWith(
            expect.objectContaining({
              headers: expect.objectContaining({
                "x-request-header": "value1",
                "X-Init-Header": "value2",
              }),
            })
          )
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});