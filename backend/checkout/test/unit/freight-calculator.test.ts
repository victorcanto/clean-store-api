import FreightCalculator from "../../src/domain/entities/freight-calculator";
import Product from "../../src/domain/entities/product";

describe("Freight Calculator", () => {
	test("Deve calcular o frete para um produto com distancia padrao", () => {
		const output = FreightCalculator.calculate(
			new Product(1, "A", 1000, 100, 30, 10, 3, "BRL")
		);
		expect(output).toBe(30);
	});

	test("Deve retornar o valor minimo de frete", () => {
		const output = FreightCalculator.calculate(
			new Product(1, "A", 10, 10, 10, 10, 0.9, "BRL")
		);
		expect(output).toBe(10);
	});

	test("Deve calcular o frete para um produto com distancia variavel", () => {
		const distance = 748.2217780081631;
		const output = FreightCalculator.calculate(
			new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"),
			distance
		);
		expect(output).toBe(22.45);
	});
});
