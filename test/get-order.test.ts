import GetOrderByCPf from "../src/application/get-order-by-cpf";
import OrderDataDb from "../src/infra/data/order-data-db";
import {
	fakeCheckout,
	fakeCheckoutInput,
	fakeOrderDataDb,
} from "./helpers/fake";

type SutTypes = {
	orderDataStub: OrderDataDb;
	sut: GetOrderByCPf;
};

const makeSut = (): SutTypes => {
	const orderDataStub = fakeOrderDataDb();
	const sut = new GetOrderByCPf(orderDataStub);
	return {
		orderDataStub,
		sut,
	};
};

describe("Get Order", () => {
	test("Deve chamar o OrderDataDb para consultar o pedido pelo CPF", async () => {
		const checkout = fakeCheckout();
		const input = fakeCheckoutInput();
		const { sut, orderDataStub } = makeSut();
		const orderDataDbSpy = jest.spyOn(orderDataStub, "getByCpf");
		await checkout.execute(input);
		await sut.execute(input.cpf);
		expect(orderDataDbSpy).toHaveBeenCalledWith(input.cpf);
	});

	test("Deve retornar o total do pedido ao consultar o pedido pelo CPF", async () => {
		const checkout = fakeCheckout();
		const input = fakeCheckoutInput();
		const { sut } = makeSut();
		await checkout.execute(input);
		const output = await sut.execute(input.cpf);
		expect(output.total).toBe(6350);
	});
});
