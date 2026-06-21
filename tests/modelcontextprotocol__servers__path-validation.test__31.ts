it('handles allowed directories with traversal that normalizes safely', () => {
      // These allowed dirs contain traversal but normalize to valid paths
      const allowed = ['/home/user/../user/project'];

      // Should normalize to /home/user/project and work correctly
      expect(isPathWithinAllowedDirectories('/home/user/project/file', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/other', allowed)).toBe(false);
    })