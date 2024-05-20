import Coupon from "./coupon";
import Cpf from "./cpf";
import FreightCalculator from "./freight-calculator";
import Item from "./item";
import OrderCode from "./order-code";
import Product from "./product";

export default class Order {
	items: Item[] = [];
	coupon?: Coupon;
	freight = 0;
	code: OrderCode;

	constructor(
		readonly cpf: Cpf,
		readonly date = new Date(),
		readonly sequence = 1
	) {
		this.code = new OrderCode(this.date, this.sequence);
	}

	addItem(
		product: Product,
		quantity: number,
		currencyCode = "BRL",
		currencyValue = 1
	) {
		if (this.items.some((item) => item.idProduct === product.idProduct)) {
			throw new Error("Duplicated product in the same order");
		}
		this.items.push(
			new Item(
				product.idProduct,
				product.price,
				quantity,
				currencyCode,
				currencyValue
			)
		);
		this.freight += FreightCalculator.calculate(product);
	}

	addCoupon(coupon: Coupon): void {
		if (coupon.isExpired()) return;
		this.coupon = coupon;
	}

	getTotal(): number {
		let total = 0;
		for (const item of this.items) {
			total += item.getTotal();
		}
		if (this.coupon) {
			total -= this.coupon.getDiscount(total);
		}
		total += this.freight;
		return total;
	}

	getCode(): string {
		return this.code.getValue();
	}
}
