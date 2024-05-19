import Checkout, { CheckoutInput } from "../../src/checkout";
import CouponData from "../../src/coupon-data";
import { CouponModel } from "../../src/coupon-model";
import CurrencyGateway from "../../src/currency-gateway";
import Mailer from "../../src/mailer";
import OrderData from "../../src/order-data";
import ProductData from "../../src/product-data";
import { ProductModel } from "../../src/product-model";

export const fakeCouponDataDb = (): CouponData => {
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

export const fakeProductDataDb = (): ProductData => {
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

export const fakeOrderDataDb = (): any => {
	class OrderDataDbStub implements OrderData {
		async save(order: any): Promise<void> {
			return Promise.resolve();
		}
		async getByCpf(cpf: string): Promise<any> {
			return Promise.resolve({ total: 6350 });
		}
		async count(): Promise<number> {
			return Promise.resolve(0);
		}
	}
	return new OrderDataDbStub();
};

export const fakeCurrencyGateway = (): CurrencyGateway => {
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

export const fakeMailer = (): Mailer => {
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

export const fakeCheckout = (): Checkout => {
	return new Checkout(
		fakeProductDataDb(),
		fakeCouponDataDb(),
		fakeOrderDataDb(),
		fakeCurrencyGateway(),
		fakeMailer()
	);
};

export const fakeCheckoutInput = (): CheckoutInput => {
	return {
		cpf: "454.508.362-52",
		email: "iamvictorcanto@gmail.com",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 },
		],
	};
};
