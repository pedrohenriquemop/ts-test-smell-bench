it('media and data are in PAGE_CONTENT_COMMANDS', () => {
    const { PAGE_CONTENT_COMMANDS } = require('../src/commands');
    expect(PAGE_CONTENT_COMMANDS.has('media')).toBe(true);
    expect(PAGE_CONTENT_COMMANDS.has('data')).toBe(true);
  })