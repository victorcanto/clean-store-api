import FreightCalculator from "../domain/entities/freight-calculator";
import ProductData from "../domain/repositories/product-data";

export class SimulateFreight {
	constructor(private readonly productData: ProductData) {}

	async execute(input: Input): Promise<Output> {
		let total = 0;
		for (const item of input.items) {
			const product = await this.productData.getProduct(item.idProduct);
			total += FreightCalculator.calculate(product);
		}
		return { total };
	}
}

type Input = {
	items: { idProduct: number; quantity: number }[];
};

type Output = {
	total: number;
};
