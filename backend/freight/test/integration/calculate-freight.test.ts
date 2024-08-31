import CalculateFreight from "../../src/application/calculate-freight";
import { fakeZipCodeData } from "../helpers/fake";

import ZipCodeData from "../../src/domain/repositories/zipcode-data";

import PgPromiseConnection from "../../src/infra/db/pg-promise-connection";
import ZipCodeDataDb from "../../src/infra/data/zipcode-data-db";

let connection: PgPromiseConnection;

type SutTypes = {
	zipCodeDataStub: ZipCodeData;
	sut: CalculateFreight;
};

const makeSut = (useFake = true): SutTypes => {
	const zipCodeDataStub = useFake
		? fakeZipCodeData()
		: new ZipCodeDataDb(connection);

	const sut = new CalculateFreight(zipCodeDataStub);
	return {
		zipCodeDataStub,
		sut,
	};
};

describe("Simulate Freight", () => {
	beforeEach(async () => {
		connection = new PgPromiseConnection();
	});

	afterEach(async () => {
		await connection.close();
	});

	test("Deve simular o frete para um pedido sem CEP de origem e destino", async () => {
		const { sut } = makeSut();
		const input = {
			items: [
				{
					volume: 0.03,
					density: 100,
					quantity: 1,
				},
			],
		};
		const output = await sut.execute(input);
		expect(output.total).toBe(30);
	});

	test("Deve simular o frete para um pedido com CEP de origem e destino", async () => {
		const { sut } = makeSut();
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
		const output = await sut.execute(input);
		expect(output.total).toBe(22.45);
	});

	test("Deve simular o frete para um pedido com CEP de origem e destino usando o banco de dados", async () => {
		const { sut } = makeSut(false);
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
		const output = await sut.execute(input);
		expect(output.total).toBe(22.45);
	});
});
