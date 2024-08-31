import Coupon from "../domain/entities/coupon";
import CouponData from "../domain/repositories/coupon-data";
import Cpf from "../domain/entities/cpf";
import CurrencyGateway from "../infra/gateway/currency-gateway";
import Mailer from "../infra/mailer/mailer";
import Order from "../domain/entities/order";
import OrderData from "../domain/repositories/order-data";
import FreightGateway from "../infra/gateway/freight-gateway";
import CatalogGateway from "../infra/gateway/catalog-gateway";

export default class Checkout {
	constructor(
		private readonly catalogGateway: CatalogGateway,
		private readonly couponData: CouponData,
		private readonly orderData: OrderData,
		private readonly freightGateway: FreightGateway,
		private readonly currencyGateway: CurrencyGateway,
		private readonly mailer: Mailer
	) {}

	async execute(input: CheckoutInput): Promise<CheckoutOutput> {
		const currencies = await this.currencyGateway.getCurrencies();
		const order = new Order(new Cpf(input.cpf));
		const freightItems = [];
		for (const item of input.items) {
			const product = await this.catalogGateway.getProduct(
				item.idProduct
			);
			order.addItem(
				product,
				item.quantity,
				product.currency,
				currencies.getCurrency(product.currency)
			);
			freightItems.push({
				volume: product.volume,
				density: product.density,
				quantity: item.quantity,
			});
		}
		const freight = await this.freightGateway.calculateFreight(
			freightItems,
			input.from,
			input.to
		);
		order.freight = freight.total;
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
	from?: string;
	to?: string;
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
