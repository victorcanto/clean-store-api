import Checkout, { CheckoutInput } from "../../src/application/checkout";
import Coupon from "../../src/domain/entities/coupon";
import CouponData from "../../src/domain/repositories/coupon-data";
import Cpf from "../../src/domain/entities/cpf";
import Currencies from "../../src/domain/entities/currencies";
import CurrencyGateway from "../../src/infra/gateway/currency-gateway";
import Mailer from "../../src/infra/mailer/mailer";
import Order from "../../src/domain/entities/order";
import OrderData from "../../src/domain/repositories/order-data";
import Product from "../../src/domain/entities/product";
import ProductData from "../../src/domain/repositories/product-data";

export const fakeCouponDataDb = (): CouponData => {
	class CouponDataDbStub implements CouponData {
		async getCoupon(code: string): Promise<Coupon> {
			const coupons: { [code: string]: any } = {
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
			return Promise.resolve(
				new Coupon(
					coupons[code].code,
					coupons[code].percentage,
					coupons[code].expireDate
				)
			);
		}
	}
	return new CouponDataDbStub();
};

export const fakeProductDataDb = (): ProductData => {
	class ProductDataDbStub implements ProductData {
		async getProduct(idProduct: number): Promise<Product> {
			const products: { [idProduct: number]: Product } = {
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

export const fakeOrder = (cpf: string): Order => {
	const order = new Order(new Cpf(cpf));
	order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
	order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22, "BRL"), 1);
	order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9, "BRL"), 3);
	return order;
};

export const fakeOrderDataDb = (): any => {
	class OrderDataDbStub implements OrderData {
		async save(order: Order): Promise<void> {
			return Promise.resolve();
		}
		async getByCpf(cpf: string): Promise<Order> {
			const order = fakeOrder(cpf);
			return Promise.resolve(order);
		}
		async count(): Promise<number> {
			return Promise.resolve(0);
		}
	}
	return new OrderDataDbStub();
};

export const fakeCurrencyGateway = (): CurrencyGateway => {
	class CurrencyGatewayStub implements CurrencyGateway {
		async getCurrencies(): Promise<Currencies> {
			const currencies = new Currencies();
			currencies.addCurrency("USD", 3);
			currencies.addCurrency("BRL", 1);
			return Promise.resolve(currencies);
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
