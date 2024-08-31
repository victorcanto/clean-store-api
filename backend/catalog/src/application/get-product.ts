import ProductData from "../domain/repositories/product-data";

export default class GetProduct {
	constructor(private readonly productData: ProductData) {}

	async execute(idProduct: number): Promise<Output> {
		const product = await this.productData.getProduct(idProduct);
		return {
			...product,
			volume: product.getVolume(),
			density: product.getDensity(),
		};
	}
}

type Output = {
	idProduct: number;
	description: string;
	price: number;
	width: number;
	height: number;
	length: number;
	weight: number;
	currency: string;
	volume: number;
	density: number;
};
