import axios from "axios";
axios.defaults.validateStatus = () => true;

describe("API", () => {
	test("Nao deve fazer um pedido com cpf invalido", async () => {
		const input = {
			cpf: "978.375.349-00",
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(422);
		const output = response.data;
		expect(output.message).toBe("Invalid cpf");
	});

	test("Deve fazer um pedido com 3 produtos", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
			],
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(200);
		const output = response.data;
		expect(output.total).toBe(6350);
	});

	test("Nao deve fazer um pedido com produto que nao existe", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [{ idProduct: 5, quantity: 3 }],
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(422);
		const output = response.data;
		expect(output.message).toBe("Product not found");
	});

	test("Deve fazer um pedido com 3 produtos com cupom de desconto", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
			],
			coupon: "VALE20",
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(200);
		const output = response.data;
		expect(output.total).toBe(5132);
	});

	test("Nao deve aplicar o desconto se o cupom for invalido", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
			],
			coupon: "VALE100",
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(422);
		const output = response.data;
		expect(output.message).toBe("Coupon not found");
	});

	test("Deve fazer um pedido com 3 produtos com cupom expirado", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
			],
			coupon: "VALE50_EXPIRED",
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(200);
		const output = response.data;
		expect(output.total).toBe(6350);
	});

	test("Deve fazer um pedido com quantidade negativa", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [{ idProduct: 1, quantity: -3 }],
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(422);
		const output = response.data;
		expect(output.message).toBe("Quantity must be positive");
	});

	test("Deve fazer um pedido com quantidade negativa", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 1, quantity: 1 },
			],
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(422);
		const output = response.data;
		expect(output.message).toBe("Duplicated product in the same order");
	});

	test("Deve fazer um pedido calculando o frete", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [{ idProduct: 1, quantity: 1 }],
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(200);
		const output = response.data;
		expect(output.total).toBe(1030);
	});

	test("Deve retornar o preco minimo de frete caso ele seja inferior ao valor calculado", async () => {
		const input = {
			cpf: "454.508.362-52",
			items: [{ idProduct: 3, quantity: 1 }],
		};

		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		expect(response.status).toBe(200);
		const output = response.data;
		expect(output.total).toBe(40);
	});
});
