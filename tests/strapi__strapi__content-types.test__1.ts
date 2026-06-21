test('Includes non writable fields', () => {
      const model = createModel({
        attributes: {
          title: {
            type: 'string',
          },
          non_writable_field: {
            type: 'string',
            writable: false,
          },
          createdAt: {
            type: 'datetime',
          },
          updatedAt: {
            type: 'datetime',
          },
        },
      });

      expect(getNonWritableAttributes(model)).toEqual([
        'id',
        'documentId',
        'createdAt',
        'updatedAt',
        'non_writable_field',
      ]);
    })