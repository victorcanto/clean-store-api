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
			const coupons: { [code: string]: Coupon } = {
				VALE10: new Coupon("VALE10", 10, new Date("2025-01-01")),
				VALE20: new Coupon("VALE20", 20, new Date("2025-01-01")),
				VALE50_EXPIRED: new Coupon(
					"VALE50_EXPIRED",
					50,
					new Date("2024-01-01")
				),
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
				1: new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"),
				2: new Product(2, "B", 5000, 50, 50, 50, 22, "BRL"),
				3: new Product(3, "C", 30, 10, 10, 10, 0.9, "BRL"),
				4: new Product(4, "D", 100, 100, 30, 100, 3, "USD"),
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
