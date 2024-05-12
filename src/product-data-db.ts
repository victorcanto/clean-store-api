import pgPromise from "pg-promise";
import env from "./config/env";
import ProductData from "./product-data";

export default class ProductDataDb implements ProductData {
	async getProduct(idProduct: number): Promise<any> {
		const connection = pgPromise()(env.postgreUrl);
		const [product] = await connection.query(
			"select * from store.product where id_product = $1",
			[idProduct]
		);
		await connection.$pool.end();
		return product;
	}
}
