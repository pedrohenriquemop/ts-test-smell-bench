test("Proceeds with the network call if a value for the access token is specified and the supplied path/id is not a valid file path", async () => {
        fs.access = vi.fn().mockRejectedValueOnce(undefined);

        const sampleCollectionContents: HoppCollection = {
          v: CollectionSchemaVersion,
          name: "test-coll",
          folders: [],
          requests: [getDefaultRESTRequest()],
          headers: [],
          auth: {
            authType: "none",
            authActive: false,
          },
        };

        axios.get = vi.fn().mockImplementation(() =>
          Promise.resolve({
            data: {
              id: "clx06ik0o00028t6uwywwnxgg",
              data: null,
              title: "test-coll",
              parentID: null,
              folders: [],
              requests: [
                {
                  id: "clx06imin00038t6uynt5vyk4",
                  collectionID: "clx06ik0o00028t6uwywwnxgg",
                  teamID: "clwt6r6j10031kc6pu0b08y6e",
                  title: "req1",
                  request:
                    '{"v":"4","auth":{"authType":"inherit","authActive":true},"body":{"body":null,"contentType":null},"name":"req1","method":"GET","params":[],"headers":[],"endpoint":"https://echo.hoppscotch.io","testScript":"","preRequestScript":"","requestVariables":[]}',
                },
              ],
            },
            headers: {
              "content-type": "application/json",
            },
          })
        );

        const readJsonFileSpy = vi
          .spyOn(mutators, "readJsonFile")
          .mockImplementation(() => Promise.resolve(sampleCollectionContents));

        vi.spyOn(
          workspaceAccessHelpers,
          "transformWorkspaceCollections"
        ).mockImplementation(() => [sampleCollectionContents]);

        const pathOrId = "valid-collection-id";
        const resourceType = "collection";
        const accessToken = "valid-access-token";
        const serverUrl = "valid-url";

        // Clear spy calls from setup
        readJsonFileSpy.mockClear();

        await getResourceContents({
          pathOrId,
          accessToken,
          serverUrl,
          resourceType,
        });

        expect(fs.access).toHaveBeenCalledWith(pathOrId);
        expect(axios.get).toBeCalledWith(
          `${serverUrl}/v1/access-tokens/${resourceType}/${pathOrId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        expect(
          workspaceAccessHelpers.transformWorkspaceCollections
        ).toBeCalled();
        expect(readJsonFileSpy).not.toHaveBeenCalled();
      })