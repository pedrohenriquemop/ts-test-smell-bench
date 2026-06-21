it('should allow overwrites to legitimate files within allowed directories', async () => {
      const allowed = [allowedDir];
      const legitFile = path.join(allowedDir, 'legit-file.txt');

      // Create a legitimate file
      await fs.writeFile(legitFile, 'ORIGINAL', 'utf-8');

      // Opening with w should work for legitimate files
      const fd = await fs.open(legitFile, 'w');
      try {
        await fd.write('UPDATED', 0, 'utf-8');
      } finally {
        await fd.close();
      }

      const content = await fs.readFile(legitFile, 'utf-8');
      expect(content).toBe('UPDATED');
    })