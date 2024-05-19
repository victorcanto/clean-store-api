import Checkout from "../src/checkout";
import CouponData from "../src/coupon-data";
import CurrencyGateway from "../src/currency-gateway";
import Mailer from "../src/mailer";
import OrderData from "../src/order-data";
import ProductData from "../src/product-data";

import {
	fakeCheckoutInput,
	fakeCouponDataDb,
	fakeCurrencyGateway,
	fakeMailer,
	fakeOrderDataDb,
	fakeProductDataDb,
} from "./helpers/fake";

type SutTypes = {
	couponDataStub: CouponData;
	productDataStub: ProductData;
	orderDataStub: OrderData;
	currencyGatewayStub: CurrencyGateway;
	mailerStub: Mailer;
	sut: Checkout;
};

const makeSut = (): SutTypes => {
	const productDataStub = fakeProductDataDb();
	const couponDataStub = fakeCouponDataDb();
	const orderDataStub = fakeOrderDataDb();
	const currencyGatewayStub = fakeCurrencyGateway();
	const mailerStub = fakeMailer();
	const sut = new Checkout(
		productDataStub,
		couponDataStub,
		orderDataStub,
		currencyGatewayStub,
		mailerStub
	);
	return {
		couponDataStub,
		productDataStub,
		orderDataStub,
		currencyGatewayStub,
		mailerStub,
		sut,
	};
};

const fakeCheckoutInputWithFourProducts = () => ({
	...fakeCheckoutInput(),
	items: [...fakeCheckoutInput().items, { idProduct: 4, quantity: 1 }],
});

describe("Checkout", () => {
	test("Deve fazer um pedido com 4 produtos com moedas diferentes", async () => {
		const { sut, currencyGatewayStub } = makeSut();
		const input = fakeCheckoutInputWithFourProducts();
		const currencyGatewaySpy = jest.spyOn(
			currencyGatewayStub,
			"getCurrencies"
		);
		const output = await sut.execute(input);
		expect(currencyGatewaySpy).toHaveBeenCalledTimes(1);
		expect(output.total).toBe(6680);
	});

	test("Deve salvar o pedido", async () => {
		const { sut, orderDataStub } = makeSut();
		const input = fakeCheckoutInputWithFourProducts();
		const orderDataSpy = jest.spyOn(orderDataStub, "save");
		const output = await sut.execute(input);
		expect(orderDataSpy).toHaveBeenCalledWith({
			cpf: input.cpf,
			total: output.total,
		});
		expect(orderDataSpy).toHaveBeenCalledTimes(1);
		expect(output.total).toBe(6680);
	});

	test("Deve enviar um email informando que o pedido foi concluído", async () => {
		const { sut, mailerStub } = makeSut();
		const input = fakeCheckoutInputWithFourProducts();
		const mailerSpy = jest.spyOn(mailerStub, "send");
		const output = await sut.execute(input);
		expect(mailerSpy).toHaveBeenCalledWith(
			input.email,
			"Checkout Success",
			"Your order was placed with success."
		);
		expect(mailerSpy).toHaveBeenCalledTimes(1);
		expect(output.total).toBe(6680);
	});

	test("Deve fazer um pedido com 3 produtos com codigo do pedido", async () => {
		const { sut } = makeSut();
		const input = fakeCheckoutInput();
		const output = await sut.execute(input);
		expect(output.code).toBe("202400000001");
	});
});
