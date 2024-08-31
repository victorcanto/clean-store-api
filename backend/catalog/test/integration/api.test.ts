import axios from "axios";

axios.defaults.validateStatus = () => true;

describe("API", () => {
	test("Deve retornar os produtos", async () => {
		const response = await axios.get("http://localhost:3335/products");
		const output = response.data;
		expect(response.status).toBe(200);
		expect(output).toHaveLength(4);
	});

	test("Deve retornar um produto", async () => {
		const response = await axios.get("http://localhost:3335/products/1");
		const output = response.data;
		expect(response.status).toBe(200);
		expect(output).toEqual({
			idProduct: 1,
			description: "A",
			price: 1000,
			width: 100,
			height: 30,
			length: 10,
			weight: 3,
			currency: "BRL",
			volume: 0.03,
			density: 100,
		});
	});
});
