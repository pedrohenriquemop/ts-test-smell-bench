it('exports to JSONL file', () => {
    const buf = new SizeCappedBuffer(1000);
    buf.push(makeEntry(10, 'https://a.com'));
    buf.push(makeEntry(20, 'https://b.com'));

    const tmpFile = path.join(os.tmpdir(), `test-export-${Date.now()}.jsonl`);
    try {
      const count = buf.exportToFile(tmpFile);
      expect(count).toBe(2);
      const lines = fs.readFileSync(tmpFile, 'utf-8').trim().split('\n');
      expect(lines.length).toBe(2);
      const parsed = JSON.parse(lines[0]);
      expect(parsed.url).toBe('https://a.com');
    } finally {
      fs.unlinkSync(tmpFile);
    }
  })