import DistanceCalculator from "../domain/entities/distance-calculator";
import FreightCalculator from "../domain/entities/freight-calculator";
import ProductData from "../domain/repositories/product-data";
import ZipCodeData from "../domain/repositories/zipcode-data";

export default class CalculateFreight {
	constructor(
		private readonly productData: ProductData,
		private readonly zipCodeData: ZipCodeData
	) {}

	async execute(input: Input): Promise<Output> {
		let distance;

		if (input.from && input.to) {
			const from = await this.zipCodeData.get(input.from);
			const to = await this.zipCodeData.get(input.to);
			if (from && to) {
				distance = DistanceCalculator.calculate(from.coord, to.coord);
			}
		}
		let total = 0;
		for (const item of input.items) {
			const product = await this.productData.getProduct(item.idProduct);
			total += FreightCalculator.calculate(product, distance);
		}
		return { total };
	}
}

type Input = {
	from?: string;
	to?: string;
	items: { idProduct: number; quantity: number }[];
};

type Output = {
	total: number;
};
