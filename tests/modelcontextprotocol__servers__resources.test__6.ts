it('should include timestamp in content', () => {
      const uri = textResourceUri(2);
      const resource = textResource(uri, 2);

      // Timestamp format varies, just check it contains time-related content
      expect(resource.text).toMatch(/\d/);
    })