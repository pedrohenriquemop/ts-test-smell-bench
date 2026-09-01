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
    it("should extract headers from Request object", async () => {
          const hoppFetch = createHoppFetchHook()

          const request = new Request("https://api.example.com/data", {
            headers: {
              "X-Custom-Header": "test-value",
              Authorization: "Bearer token123",
            },
          })

          await hoppFetch(request)

          expect(mockAxiosInstance).toHaveBeenCalledWith(
            expect.objectContaining({
              headers: expect.objectContaining({
                "x-custom-header": "test-value",
                authorization: "Bearer token123",
              }),
            })
          )
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});