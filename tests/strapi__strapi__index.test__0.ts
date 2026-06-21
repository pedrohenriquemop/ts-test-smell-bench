it('loads all commands without error', () => {
      createCLI([]);
      expect(consoleMock.error).not.toHaveBeenCalled();
    })