import CalculateFreight from "../../src/application/calculate-freight";
import { fakeProductDataDb, fakeZipCodeData } from "../helpers/fake";
import ProductData from "../../src/domain/repositories/product-data";
import ZipCodeData from "../../src/domain/repositories/zipcode-data";
import ProductDataDb from "../../src/infra/data/product-data-db";
import PgPromiseConnection from "../../src/infra/db/pg-promise-connection";
import ZipCodeDataDb from "../../src/infra/data/zipcode-data-db";

const connection = new PgPromiseConnection();

type SutTypes = {
	productDataStub: ProductData;
	zipCodeDataStub: ZipCodeData;
	connection: PgPromiseConnection;
	sut: CalculateFreight;
};

const makeSut = (useFake = true): SutTypes => {
	let productDataStub: ProductData;
	let zipCodeDataStub: ZipCodeData;
	if (!useFake) {
		productDataStub = new ProductDataDb(connection);
		zipCodeDataStub = new ZipCodeDataDb(connection);
	} else {
		productDataStub = fakeProductDataDb();
		zipCodeDataStub = fakeZipCodeData();
	}
	const sut = new CalculateFreight(productDataStub, zipCodeDataStub);
	return {
		productDataStub,
		zipCodeDataStub,
		connection,
		sut,
	};
};

describe("Simulate Freight", () => {
	afterEach(async () => {});
	test("Deve simular o frete para um pedido sem CEP de origem e destino", async () => {
		const { sut } = makeSut();
		const input = {
			items: [
				{
					idProduct: 1,
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
					idProduct: 1,
					quantity: 1,
				},
			],
		};
		const output = await sut.execute(input);
		expect(output.total).toBe(22.45);
	});

	test("Deve simular o frete para um pedido com CEP de origem e destino usando o banco de dados", async () => {
		const { sut, connection } = makeSut(false);
		const input = {
			from: "22030060",
			to: "88015600",
			items: [
				{
					idProduct: 1,
					quantity: 1,
				},
			],
		};
		const output = await sut.execute(input);
		expect(output.total).toBe(22.45);
		await connection.close();
	});
});
