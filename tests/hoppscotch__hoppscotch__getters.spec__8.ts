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

  describe("getResolvedVariables", () => {
    const requestVariables = [
          {
            key: "SHARED_KEY_I",
            value: "request-variable-shared-value-I",
            active: true,
          },
          {
            key: "SHARED_KEY_II",
            value: "",
            active: true,
          },
          {
            key: "REQUEST_VAR_III",
            value: "request-variable-value-III",
            active: true,
          },
          {
            key: "REQUEST_VAR_IV",
            value: "request-variable-value-IV",
            active: false,
          },
          {
            key: "REQUEST_VAR_V",
            value: "request-variable-value-V",
            active: false,
          },
        ];
    const environmentVariables = [
          {
            key: "SHARED_KEY_I",
            initialValue: "environment-variable-shared-value-I",
            currentValue: "environment-variable-shared-value-I",
            secret: false,
          },
          {
            key: "SHARED_KEY_II",
            initialValue: "environment-variable-shared-value-II",
            currentValue: "environment-variable-shared-value-II",
            secret: false,
          },
          {
            key: "ENV_VAR_III",
            initialValue: "environment-variable-value-III",
            currentValue: "environment-variable-value-III",
            secret: false,
          },
          {
            key: "ENV_VAR_IV",
            initialValue: "environment-variable-value-IV",
            currentValue: "environment-variable-value-IV",
            secret: false,
          },
          {
            key: "ENV_VAR_V",
            initialValue: "environment-variable-value-V",
            currentValue: "environment-variable-value-V",
            secret: false,
          },
        ];

    // ── TARGET TEST ─────────────────────────────────
    test("Filters request variables by active status and value fields, then remove environment variables sharing the same keys", () => {
          const expected = [
            {
              key: "SHARED_KEY_I",
              currentValue: "request-variable-shared-value-I",
              initialValue: "request-variable-shared-value-I",
              secret: false,
            },
            {
              key: "REQUEST_VAR_III",
              currentValue: "request-variable-value-III",
              initialValue: "request-variable-value-III",
              secret: false,
            },
            {
              key: "SHARED_KEY_II",
              currentValue: "environment-variable-shared-value-II",
              initialValue: "environment-variable-shared-value-II",
              secret: false,
            },
            {
              key: "ENV_VAR_III",
              currentValue: "environment-variable-value-III",
              initialValue: "environment-variable-value-III",
              secret: false,
            },
            {
              key: "ENV_VAR_IV",
              currentValue: "environment-variable-value-IV",
              initialValue: "environment-variable-value-IV",
              secret: false,
            },
            {
              key: "ENV_VAR_V",
              currentValue: "environment-variable-value-V",
              initialValue: "environment-variable-value-V",
              secret: false,
            },
          ];

          expect(
            getResolvedVariables(requestVariables, environmentVariables)
          ).toEqual(expected);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});