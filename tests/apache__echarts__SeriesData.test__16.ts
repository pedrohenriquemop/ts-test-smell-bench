it('sourceFormatOriginal', function () {
                const list = new SeriesData(['x', 'y'], new Model());
                list.initData([
                    { value: 10, name: 'a' },
                    { value: 20, name: 'b' },
                    { value: 30, name: 'b' },
                    { value: 40, name: 'c' },
                    { value: 50 }, // name not declared
                    { value: 60, name: 'c' },
                    { value: 70, name: 'd' },
                    { value: 80, name: 'c' }
                ]);

                doChecks(list);
            })