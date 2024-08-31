import ProductData from "../../domain/repositories/product-data";
import Product from "../../domain/entities/product";
import DbConnection from "../db/db-connection";

export default class ProductDataDb implements ProductData {
	constructor(private readonly connection: DbConnection) {}

	async getProduct(idProduct: number): Promise<Product> {
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

	async getAllProducts(): Promise<Product[]> {
		const productData = await this.connection.query(
			"select * from store.product"
		);
		if (!productData) throw new Error("Products not found");
		return productData.map((product: any) => {
			return new Product(
				product.id_product,
				product.description,
				parseFloat(product.price),
				parseInt(product.width),
				parseInt(product.height),
				parseInt(product.length),
				parseFloat(product.weight),
				product.currency
			);
		});
	}
}
