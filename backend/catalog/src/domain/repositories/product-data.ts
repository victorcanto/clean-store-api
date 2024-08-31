import Product from "../entities/product";

export default interface ProductData {
	getProduct(idProduct: number): Promise<Product>;
	getAllProducts(): Promise<Product[]>;
}
