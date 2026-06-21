it('returns normalized non-Windows/WSL/Unix-style Windows paths as is after basic normalization', () => {
      // A path that looks somewhat absolute but isn't a drive or recognized Unix root for Windows conversion
      // These paths should be preserved as-is (not converted to Windows C:\ format or WSL format)
      const otherAbsolutePath = '\\someserver\\share\\file';
      expect(normalizePath(otherAbsolutePath)).toBe(otherAbsolutePath);
    })