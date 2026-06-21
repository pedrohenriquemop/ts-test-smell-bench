it('uses alphabetical tiebreak for deterministic suggestions', () => {
    // Synthetic command set where two commands tie on distance from input
    const syntheticSet = new Set(['alpha', 'beta']);
    // 'alpha' vs 'delta' = 3 edits; 'beta' vs 'delta' = 2 edits
    // Let's use a case that genuinely ties.
    const ties = new Set(['abcd', 'abce']); // both distance 1 from 'abcf'
    const msg = buildUnknownCommandError('abcf', ties, {}, {});
    // Alphabetical first: 'abcd' comes before 'abce'
    expect(msg).toContain(`Did you mean 'abcd'?`);
  })