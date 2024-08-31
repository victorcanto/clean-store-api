import axios from "axios";
import CatalogGateway from "./catalog-gateway";
import Product from "../../domain/entities/product";

export default class CatalogGatewayHttp implements CatalogGateway {
	async getProduct(idProduct: number): Promise<Product> {
		const response = await axios(
			`http://localhost:3335/products/${idProduct}`
		);
		const productData = response.data;
		return new Product(
			productData.idProduct,
			productData.description,
			productData.price,
			productData.width,
			productData.height,
			productData.length,
			productData.weight,
			productData.currency,
			productData.volume,
			productData.density
		);
	}
}
