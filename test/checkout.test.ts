import Checkout from "../src/checkout";
import CouponData from "../src/coupon-data";
import { CouponModel } from "../src/coupon-model";
import CurrencyGateway from "../src/currency-gateway";
import Mailer from "../src/mailer";
import ProductData from "../src/product-data";
import { ProductModel } from "../src/product-model";

const fakeCouponDataDb = (): CouponData => {
	class CouponDataDbStub implements CouponData {
		async getCoupon(code: string): Promise<CouponModel> {
			const coupons: { [code: string]: CouponModel } = {
				VALE10: {
					code: "VALE10",
					percentage: 10,
					expireDate: new Date("2025-01-01"),
				},
				VALE20: {
					code: "VALE20",
					percentage: 20,
					expireDate: new Date("2025-01-01"),
				},
				VALE50_EXPIRED: {
					code: "VALE50_EXPIRED",
					percentage: 50,
					expireDate: new Date("2024-01-01"),
				},
			};
			return Promise.resolve(coupons[code]);
		}
	}
	return new CouponDataDbStub();
};

const fakeProductDataDb = (): ProductData => {
	class ProductDataDbStub implements ProductData {
		async getProduct(idProduct: number): Promise<ProductModel> {
			const products: { [idProduct: number]: ProductModel } = {
				1: {
					idProduct: 1,
					description: "A",
					price: 1000,
					width: 100,
					height: 30,
					length: 10,
					weight: 3,
					currency: "BRL",
				},
				2: {
					idProduct: 2,
					description: "B",
					price: 5000,
					width: 50,
					height: 50,
					length: 50,
					weight: 22,
					currency: "BRL",
				},
				3: {
					idProduct: 3,
					description: "C",
					price: 30,
					width: 10,
					height: 10,
					length: 10,
					weight: 0.9,
					currency: "BRL",
				},
				4: {
					idProduct: 4,
					description: "D",
					price: 100,
					width: 100,
					height: 30,
					length: 10,
					weight: 3,
					currency: "USD",
				},
			};
			return Promise.resolve(products[idProduct]);
		}
	}
	return new ProductDataDbStub();
};

const fakeCurrencyGateway = (): CurrencyGateway => {
	class CurrencyGatewayStub implements CurrencyGateway {
		async getCurrencies(): Promise<{ [key: string]: number }> {
			return Promise.resolve({
				BRL: 1,
				USD: 3,
			});
		}
	}
	return new CurrencyGatewayStub();
};

const fakeMailer = (): Mailer => {
	class MailerStub implements Mailer {
		logs: object[] = [];
		async send(
			to: string,
			subject: string,
			message: string
		): Promise<boolean> {
			return true;
		}
	}
	return new MailerStub();
};

type SutTypes = {
	couponDataStub: CouponData;
	productDataStub: ProductData;
	currencyGatewayStub: CurrencyGateway;
	mailerStub: Mailer;
	sut: Checkout;
};

const makeSut = (): SutTypes => {
	const productDataStub = fakeProductDataDb();
	const couponDataStub = fakeCouponDataDb();
	const currencyGatewayStub = fakeCurrencyGateway();
	const mailerStub = fakeMailer();
	const sut = new Checkout(
		productDataStub,
		couponDataStub,
		currencyGatewayStub,
		mailerStub
	);
	return {
		couponDataStub,
		productDataStub,
		currencyGatewayStub,
		mailerStub,
		sut,
	};
};

describe("Checkout", () => {
	test("Deve fazer um pedido com 4 produtos com moedas diferentes", async () => {
		const { sut, currencyGatewayStub } = makeSut();
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
				{ idProduct: 4, quantity: 1 },
			],
		};
		const currencyGatewaySpy = jest.spyOn(
			currencyGatewayStub,
			"getCurrencies"
		);
		const output = await sut.execute(input);
		expect(currencyGatewaySpy).toHaveBeenCalledTimes(1);
		expect(output.total).toBe(6680);
	});

	test("Deve enviar um email informando que o pedido foi concluído", async () => {
		const { sut, mailerStub } = makeSut();
		const input = {
			cpf: "454.508.362-52",
			email: "iamvictorcanto@gmail.com",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
				{ idProduct: 4, quantity: 1 },
			],
		};
		const mailerSpy = jest.spyOn(mailerStub, "send");
		const output = await sut.execute(input);
		expect(mailerSpy).toHaveBeenCalledWith(
			"iamvictorcanto@gmail.com",
			"Checkout Success",
			"Your order was placed with success."
		);
		expect(mailerSpy).toHaveBeenCalledTimes(1);
		expect(output.total).toBe(6680);
	});
});
