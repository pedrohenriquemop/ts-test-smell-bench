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