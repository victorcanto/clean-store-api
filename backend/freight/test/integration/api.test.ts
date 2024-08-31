import axios from "axios";
axios.defaults.validateStatus = () => true;

describe("API", () => {
	test("Deve calcular o frete", async () => {
		const input = {
			from: "22030060",
			to: "88015600",
			items: [
				{
					volume: 0.03,
					density: 100,
					quantity: 1,
				},
			],
		};

		const response = await axios.post(
			"http://localhost:3334/calculateFreight",
			input
		);
		expect(response.status).toBe(200);
		const output = response.data;
		expect(output.total).toBe(22.45);
	});
});
