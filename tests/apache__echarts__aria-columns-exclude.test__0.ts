it('specified columns should be omitted from Aria (geolocation and name)', () => {
        chart.setOption(option);
        const el = chart.getDom();
        const ariaValue = el.getAttribute('aria-label');
        expect(ariaValue).toContain('Llosa del Cavall (Navès) is 17.945, 80');
        expect(ariaValue).toContain('Riudecanyes is 0.401, 5.32');
        expect(ariaValue).not.toContain(1.58285827);
        expect(ariaValue).not.toContain(42.099784969);
        expect(ariaValue).not.toContain(0.960270444);
        expect(ariaValue).not.toContain(41.134931354);
    })