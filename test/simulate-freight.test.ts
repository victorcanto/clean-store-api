import ProductDataDb from "../src/product-data-db";
import { SimulateFreight } from "../src/simulate-freight";
import { fakeProductDataDb } from "./helpers/fake";

type SutTypes = {
	productDataStub: ProductDataDb;
	sut: SimulateFreight;
};

const makeSut = (): SutTypes => {
	const productDataStub = fakeProductDataDb();
	const sut = new SimulateFreight(productDataStub);
	return {
		sut,
		productDataStub,
	};
};

describe("Simulate Freight", () => {
	test("Deve simular o frete para um pedido", async () => {
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
});
