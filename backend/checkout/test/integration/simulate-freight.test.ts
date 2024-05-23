import { SimulateFreight } from "../../src/application/simulate-freight";
import { fakeProductDataDb } from "../helpers/fake";
import ProductData from "../../src/domain/repositories/product-data";

type SutTypes = {
	productDataStub: ProductData;
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
