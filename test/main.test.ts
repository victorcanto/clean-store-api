import axios from "axios";
import { CpfValidator } from "../src/cpf-validator";

axios.defaults.validateStatus = () => true;

const validCpfs = [
	"454.508.362-52",
	"783.916.609-15",
	"170.598.601-34",
	"545.482.777-06",
	"337.311.153-60",
	"564.201.508-76",
	"716.012.656-46",
	"541.701.122-37",
	"606.468.947-14",
	"777.866.447-09",
];

const invalidCpfs = [
	"111.111.111-11",
	"222.222.222-22",
	"333.333.333-33",
	"444.444.444-44",
	"555.555.555-55",
	"666.666.666-66",
	"777.777.777-77",
	"888.888.888-88",
	"999.999.999-99",
	"123.456.789-10",
	"234.244.544-55",
	"978.375.349-00",
];

describe("Validacao de CPFs", () => {
	const cpfValidator = new CpfValidator();

	test.each(validCpfs)("Valido: %s", (cpf) => {
		expect(cpfValidator.validate(cpf)).toBeTruthy();
	});

	test.each(invalidCpfs)("Invalido: %s", (cpf) => {
		expect(cpfValidator.validate(cpf)).toBeFalsy();
	});

	test("Nao deve fazer um pedido com cpf invalido", async () => {
		const input = {
			cpf: invalidCpfs[0],
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
			cpf: validCpfs[0],
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
		expect(output.total).toBe(6090);
	});

	test("Nao deve fazer um pedido com produto que nao existe", async () => {
		const input = {
			cpf: validCpfs[0],
			items: [{ idProduct: 4, quantity: 3 }],
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
			cpf: validCpfs[0],
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
		expect(output.total).toBe(4872);
	});

	test("Nao deve aplicar o desconto se o cupom for invalido", async () => {
		const input = {
			cpf: validCpfs[0],
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
});
