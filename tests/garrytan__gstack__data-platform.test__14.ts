it('write-commands.ts contains MIME mappings', () => {
    const src = fs.readFileSync(path.join(import.meta.dir, '../src/write-commands.ts'), 'utf-8');
    expect(src).toContain("'image/png': '.png'");
    expect(src).toContain("'image/jpeg': '.jpg'");
    expect(src).toContain("'video/mp4': '.mp4'");
    expect(src).toContain("'audio/mpeg': '.mp3'");
  })