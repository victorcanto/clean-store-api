import ProductData from "../../domain/repositories/product-data";
import Product from "../../domain/entities/product";
import DbConnection from "../db/db-connection";

export default class ProductDataDb implements ProductData {
	constructor(private readonly connection: DbConnection) {}

	async getProduct(idProduct: number): Promise<Product | null> {
		const [productData] = await this.connection.query(
			"select * from store.product where id_product = $1",
			[idProduct]
		);
		if (!productData) throw new Error("Product not found");
		return new Product(
			productData.id_product,
			productData.description,
			parseFloat(productData.price),
			parseInt(productData.width),
			parseInt(productData.height),
			parseInt(productData.length),
			parseFloat(productData.weight),
			productData.currency
		);
	}
}
