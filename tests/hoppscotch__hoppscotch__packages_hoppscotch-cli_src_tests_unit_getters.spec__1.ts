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

  describe("getEffectiveFinalMetaData", () => {
    const environmentVariables = [
          {
            key: "PARAM",
            initialValue: "parsed_param",
            currentValue: "parsed_param",
            secret: false,
          },
        ];

    // ── TARGET TEST ─────────────────────────────────
    test("Non-empty active list of meta-data with unavailable ENV", () => {
          expect(
            getEffectiveFinalMetaData(
              [
                {
                  active: true,
                  key: "<<UNKNOWN_KEY>>",
                  value: "<<UNKNOWN_VALUE>>",
                  description: "",
                },
              ],
              environmentVariables
            )
          ).toSubsetEqualRight([{ active: true, key: "", value: "" }]);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});