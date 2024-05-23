import Checkout from "../../src/application/checkout";
import CouponData from "../../src/domain/repositories/coupon-data";
import CurrencyGateway from "../../src/infra/gateway/currency-gateway";
import Mailer from "../../src/infra/mailer/mailer";
import Order from "../../src/domain/entities/order";
import OrderData from "../../src/domain/repositories/order-data";
import Product from "../../src/domain/entities/product";
import ProductData from "../../src/domain/repositories/product-data";
import {
	fakeCheckoutInput,
	fakeCouponDataDb,
	fakeCurrencyGateway,
	fakeMailer,
	fakeOrder,
	fakeOrderDataDb,
	fakeProductDataDb,
} from "../helpers/fake";
import Mockdate from "mockdate";

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

export const fakeOrderWithFourItems = (cpf: string): Order => {
	const order = fakeOrder(cpf);
	order.addItem(new Product(4, "D", 100, 100, 30, 10, 3, "USD"), 1, "USD", 3);
	return order;
};

describe("Checkout", () => {
	beforeEach(() => {
		Mockdate.set(new Date());
	});

	afterEach(() => {
		Mockdate.reset();
	});

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
		const order = fakeOrderWithFourItems(input.cpf);
		expect(orderDataSpy).toHaveBeenCalledWith(order);
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
