import Coupon from "./coupon";
import CouponData from "./coupon-data";
import { CpfValidator } from "./cpf-validator";
import CurrencyGateway from "./currency-gateway";
import FreightCalculator from "./freight-calculator";
import Mailer from "./mailer";
import OrderData from "./order-data";
import ProductData from "./product-data";

export default class Checkout {
	constructor(
		private readonly productData: ProductData,
		private readonly couponData: CouponData,
		private readonly orderData: OrderData,
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
				product.price *
				(currencies[product.currency] || 1) *
				item.quantity;
			freight += FreightCalculator.calculate(product);
		}
		if (couponCode) {
			const couponData = await this.couponData.getCoupon(couponCode);
			if (couponData) {
				const coupon = new Coupon(
					couponData.code,
					couponData.percentage,
					couponData.expireDate
				);
				if (coupon && !coupon.isExpired()) {
					total -= coupon.getDiscount(total);
				}
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
		const today = new Date();
		const year = today.getFullYear();
		const sequence = await this.orderData.count();
		const code = `${year}${(sequence + 1).toString().padStart(8, "0")}`;
		await this.orderData.save({
			cpf: input.cpf,
			total,
		});
		return { code, total };
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
