import Product from "./product";

export default class FreightCalculator {
	static calculate(product: Product, distance = 1000) {
		const volume = product.getVolume();
		const density = product.getDensity();
		const itemFreight = distance * volume * (density / 100);
		return itemFreight >= 10 ? Math.round(itemFreight * 100) / 100 : 10;
	}
}
