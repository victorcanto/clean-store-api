import ProductData from "../domain/repositories/product-data";

export default class GetAllProducts {
	constructor(private readonly productData: ProductData) {}

	async execute(): Promise<Output> {
		const productsData = await this.productData.getAllProducts();
		const output = productsData.map((product) => {
			return {
				...product,
				volume: product.getVolume(),
				density: product.getDensity(),
			};
		});
		return output;
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
}[];
