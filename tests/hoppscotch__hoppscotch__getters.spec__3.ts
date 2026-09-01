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
    test("Active list of meta-data", () => {
          expect(
            getEffectiveFinalMetaData(
              [{ active: true, key: "PARAM", value: "<<PARAM>>", description: "" }],
              environmentVariables
            )
          ).toSubsetEqualRight([
            { active: true, key: "PARAM", value: "parsed_param" },
          ]);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});