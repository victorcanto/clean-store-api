import { ProductModel } from "./product-model";

export default interface ProductData {
	getProduct(idProduct: number): Promise<ProductModel | null>;
}
