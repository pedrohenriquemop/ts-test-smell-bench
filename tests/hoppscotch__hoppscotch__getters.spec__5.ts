import axios, { AxiosError, AxiosResponse } from "axios";
import fs from "fs/promises";
import { describe, expect, test, vi } from "vitest";
import {
  CollectionSchemaVersion,
  HoppCollection,
  getDefaultRESTRequest,
} from "@hoppscotch/data";
import { DEFAULT_DURATION_PRECISION } from "../../utils/constants";
import {
  getDurationInSeconds,
  getEffectiveFinalMetaData,
  getResolvedVariables,
  getResourceContents,
} from "../../utils/getters";
import * as mutators from "../../utils/mutators";
import * as workspaceAccessHelpers from "../../utils/workspace-access";


describe("getters", () => {

  describe("getResourceContents", () => {

    describe("Network call failure", () => {
      const args = {
              pathOrId: "test-collection-id-or-path",
              resourceType: "collection" as const,
              accessToken: "test-token",
              serverUrl: "test-url",
            };
      const cases = [
              {
                description:
                  "Promise rejects with the code `SERVER_CONNECTION_REFUSED` if the network call fails with the code `ECONNREFUSED`",
                args,
                axiosMock: {
                  code: "ECONNREFUSED",
                },
                expected: {
                  code: "SERVER_CONNECTION_REFUSED",
                  data: args.serverUrl,
                },
              },
              {
                description:
                  "Promise rejects with the code `INVALID_SERVER_URL` if the network call fails with the code `ERR_INVALID_URL`",
                args,
                axiosMock: {
                  code: "ERR_INVALID_URL",
                },
                expected: {
                  code: "INVALID_SERVER_URL",
                  data: args.serverUrl,
                },
              },
              {
                description:
                  "Promise rejects with the code `INVALID_SERVER_URL` if the network call fails with the code `ENOTFOUND`",
                args,
                axiosMock: {
                  code: "ENOTFOUND",
                },
                expected: {
                  code: "INVALID_SERVER_URL",
                  data: args.serverUrl,
                },
              },
              {
                description:
                  "Promise rejects with the code `INVALID_SERVER_URL` if the network call returns a response with a status code of `404`",
                args,
                axiosMock: {
                  response: {
                    status: 404,
                  },
                },
                expected: {
                  code: "INVALID_SERVER_URL",
                  data: args.serverUrl,
                },
              },
              {
                description:
                  "Promise rejects with the code `TOKEN_EXPIRED` if the network call fails for the same reason",
                args,
                axiosMock: {
                  response: {
                    data: {
                      reason: "TOKEN_EXPIRED",
                    },
                  },
                },
                expected: {
                  code: "TOKEN_EXPIRED",
                  data: args.accessToken,
                },
              },
              {
                description:
                  "Promise rejects with the code `TOKEN_INVALID` if the network call fails for the same reason",
                args,
                axiosMock: {
                  response: {
                    data: {
                      reason: "TOKEN_INVALID",
                    },
                  },
                },
                expected: {
                  code: "TOKEN_INVALID",
                  data: args.accessToken,
                },
              },
              {
                description:
                  "Promise rejects with the code `INVALID_ID` if the network call fails for the same reason when the supplied collection ID or path is invalid",
                args,
                axiosMock: {
                  response: {
                    data: {
                      reason: "INVALID_ID",
                    },
                  },
                },
                expected: {
                  code: "INVALID_ID",
                  data: args.pathOrId,
                },
              },
              {
                description:
                  "Promise rejects with the code `INVALID_ID` if the network call fails for the same reason when the supplied environment ID or path is invalid",
                args: {
                  ...args,
                  pathOrId: "test-environment-id-or-path",
                  resourceType: "environment" as const,
                },
                axiosMock: {
                  response: {
                    data: {
                      reason: "INVALID_ID",
                    },
                  },
                },
                expected: {
                  code: "INVALID_ID",
                  data: "test-environment-id-or-path",
                },
              },
            ];
      test.each(cases)("$description", ({ args, axiosMock, expected }) => {
              const { code, response } = axiosMock;
              const axiosErrMessage = code ?? response?.data?.reason;

              vi.spyOn(axios, "get").mockImplementation(() =>
                Promise.reject(
                  new AxiosError(
                    axiosErrMessage,
                    code,
                    undefined,
                    undefined,
                    response as AxiosResponse
                  )
                )
              );

              expect(getResourceContents(args)).rejects.toEqual(expected);
            });

      // ── TARGET TEST ─────────────────────────────────
      test("Promise rejects with the code `UNKNOWN_ERROR` while encountering an error that is not an instance of `AxiosError`", () => {
              const expected = {
                code: "UNKNOWN_ERROR",
                data: new Error("UNKNOWN_ERROR"),
              };

              vi.spyOn(axios, "get").mockImplementation(() =>
                Promise.reject(new Error("UNKNOWN_ERROR"))
              );

              expect(getResourceContents(args)).rejects.toEqual(expected);
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});