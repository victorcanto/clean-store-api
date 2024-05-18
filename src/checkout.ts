import CouponData from "./coupon-data";
import { CpfValidator } from "./cpf-validator";
import CurrencyGateway from "./currency-gateway";
import Mailer from "./mailer";
import ProductData from "./product-data";

export default class Checkout {
	constructor(
		private readonly productData: ProductData,
		private readonly couponData: CouponData,
		private readonly currencyGateway: CurrencyGateway,
		private readonly mailer: Mailer
	) {}

	async execute(input: CheckoutInput) {
		const { cpf, items, coupon: couponCode } = input;
		const isValidCpf = CpfValidator.validate(cpf);
		if (!isValidCpf) {
			throw new Error("Invalid cpf");
		}
		let total = 0;
		let freight = 0;
		const currencies = await this.currencyGateway.getCurrencies();
		const productsIds = new Set();
		for (const item of items) {
			if (productsIds.has(item.idProduct)) {
				throw new Error("Duplicated product in the same order");
			}
			productsIds.add(item.idProduct);
			const product = await this.productData.getProduct(item.idProduct);
			if (!product) {
				throw new Error("Product not found");
			}
			if (item.quantity <= 0) {
				throw new Error("Quantity must be positive");
			}
			total +=
				parseFloat(product.price) *
				(currencies[product.currency] || 1) *
				item.quantity;
			const volume =
				(product.width / 100) *
				(product.height / 100) *
				(product.length / 100);

			const density = parseFloat(product.weight) / volume;
			const itemFreight = 1000 * volume * (density / 100);
			freight += itemFreight >= 10 ? itemFreight : 10;
		}
		if (couponCode) {
			const coupon = await this.couponData.getCoupon(couponCode);
			const today = new Date();
			if (coupon && coupon.expire_date.getTime() > today.getTime()) {
				total -= total * (coupon.percentage / 100);
			}
		}
		if (input?.email) {
			await this.mailer.send(
				input.email,
				"Checkout Success",
				`Your order was placed with success.`
			);
		}
		total += freight;
		return { total };
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
