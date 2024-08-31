import FreightCalculator from "../../src/domain/entities/freight-calculator";

describe("Freight Calculator", () => {
	test("Deve calcular o frete para um produto com distancia padrao", () => {
		const output = FreightCalculator.calculate(0.03, 100);
		expect(output).toBe(30);
	});

	test("Deve retornar o valor minimo de frete", () => {
		const output = FreightCalculator.calculate(0.01, 100);
		expect(output).toBe(10);
	});

	test("Deve calcular o frete para um produto com distancia variavel", () => {
		const distance = 748.2217780081631;
		const output = FreightCalculator.calculate(0.03, 100, distance);
		expect(output).toBe(22.45);
	});
});
