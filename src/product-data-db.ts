import pgPromise from "pg-promise";
import env from "./config/env";
import ProductData from "./product-data";
import { ProductModel } from "./product-model";

export default class ProductDataDb implements ProductData {
	async getProduct(idProduct: number): Promise<ProductModel | null> {
		const connection = pgPromise()(env.postgreUrl);
		const [product] = await connection.query(
			"select * from store.product where id_product = $1",
			[idProduct]
		);
		await connection.$pool.end();
		if (!product) return null;
		const productData = {
			idProduct: product.id_product,
			description: product.description,
			price: parseFloat(product.price),
			width: parseInt(product.width),
			height: parseInt(product.height),
			length: parseInt(product.length),
			weight: parseFloat(product.weight),
			currency: product.currency,
		};
		return productData;
	}
}
