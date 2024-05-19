import FreightCalculator from "../src/freight-calculator";

describe("Freight Calculator", () => {
	test("Deve calcular o frete para um produto", () => {
		const output = FreightCalculator.calculate({
			width: 100,
			height: 30,
			length: 10,
			weight: 3,
		});
		expect(output).toBe(30);
	});

	test("Deve retornar o valor minimo de frete", () => {
		const output = FreightCalculator.calculate({
			width: 10,
			height: 10,
			length: 10,
			weight: 0.9,
		});
		expect(output).toBe(10);
	});
});
