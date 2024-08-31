import Product from "../../domain/entities/product";
import HttpClient from "../http/http-client";
import CheckoutGateway from "./checkout-gateway";

export default class CheckoutGatewayHttp implements CheckoutGateway {
	constructor(
		private readonly httpClient: HttpClient,
		private readonly baseUrl: string
	) {}
	async getProducts(): Promise<Product[]> {
		const productsData = await this.httpClient.get(
			`${this.baseUrl}/products`
		);
		console.log(productsData);
		const products: Product[] = [];
		for (const productData of productsData) {
			products.push(
				new Product(
					productData.idProduct,
					productData.description,
					productData.price
				)
			);
		}
		return products;
	}
	async checkout(order: any): Promise<any> {
		const output = await this.httpClient.post(
			`${this.baseUrl}/checkout`,
			order
		);
		return output;
	}
}
