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

    describe("Success", () => {

      // ── TARGET TEST ─────────────────────────────────
      test("Proceeds with reading from the file system if the supplied file exists in the path", async () => {
              fs.access = vi.fn().mockResolvedValueOnce(undefined);

              const sampleCollectionContents: HoppCollection = {
                v: CollectionSchemaVersion,
                id: "valid-collection-id",
                name: "valid-collection-title",
                folders: [],
                requests: [],
                headers: [],
                auth: {
                  authType: "none",
                  authActive: false,
                },
              };

              axios.get = vi.fn();

              vi.spyOn(mutators, "readJsonFile").mockImplementation(() =>
                Promise.resolve(sampleCollectionContents)
              );

              const pathOrId = "valid-collection-file-path";
              const resourceType = "collection";
              const accessToken = "valid-access-token";
              const serverUrl = "valid-url";

              const contents = await getResourceContents({
                pathOrId,
                accessToken,
                serverUrl,
                resourceType,
              });

              expect(fs.access).toHaveBeenCalledWith(pathOrId);
              expect(axios.get).not.toBeCalled();
              expect(mutators.readJsonFile).toHaveBeenCalledWith(pathOrId, true);

              expect(contents).toEqual(sampleCollectionContents);
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});