import Product from "../../domain/entities/product";

export default interface CheckoutGateway {
	getProducts(): Promise<Product[]>;
	checkout(order: any): Promise<any>;
}
