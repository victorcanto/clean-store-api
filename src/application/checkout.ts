import Coupon from "../domain/entities/coupon";
import CouponData from "../domain/repositories/coupon-data";
import Cpf from "../domain/entities/cpf";
import CurrencyGateway from "../infra/gateway/currency-gateway";
import Mailer from "../infra/mailer/mailer";
import Order from "../domain/entities/order";
import OrderData from "../domain/repositories/order-data";
import ProductData from "../domain/repositories/product-data";

export default class Checkout {
	constructor(
		private readonly productData: ProductData,
		private readonly couponData: CouponData,
		private readonly orderData: OrderData,
		private readonly currencyGateway: CurrencyGateway,
		private readonly mailer: Mailer
	) {}

	async execute(input: CheckoutInput): Promise<CheckoutOutput> {
		const currencies = await this.currencyGateway.getCurrencies();
		const order = new Order(new Cpf(input.cpf));

		for (const item of input.items) {
			const product = await this.productData.getProduct(item.idProduct);
			if (product) {
				order.addItem(
					product,
					item.quantity,
					product.currency,
					currencies.getCurrency(product.currency)
				);
			}
		}
		if (input.coupon) {
			const coupon = await this.couponData.getCoupon(input.coupon);
			if (coupon) {
				order.addCoupon(
					new Coupon(
						coupon.code,
						coupon.percentage,
						coupon.expireDate
					)
				);
			}
		}
		if (input?.email) {
			await this.mailer.send(
				input.email,
				"Checkout Success",
				`Your order was placed with success.`
			);
		}
		await this.orderData.save(order);
		return {
			code: order.getCode(),
			total: order.getTotal(),
		};
	}
}

export type CheckoutInput = {
	cpf: string;
	email?: string;
	items: {
		idProduct: number;
		quantity: number;
	}[];
	coupon?: string;
};

export type CheckoutOutput = {
	code: string;
	total: number;
};
