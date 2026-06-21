it('should not modify the data of the chart', async () => {
        chart.setOption(option);
        const listData = getECModel(chart).getSeries()[0].getData();
        expect(listData.getValues(0)).toEqual([1.58285827, 42.099784969, 'Llosa del Cavall (Navès)', 17.945, 80]);
        expect(listData.getValues(1)).toEqual([0.960270444, 41.134931354, 'Riudecanyes', 0.401, 5.32]);
    })