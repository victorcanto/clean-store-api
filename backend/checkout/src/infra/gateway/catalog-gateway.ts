import Product from "../../domain/entities/product";

export default interface CatalogGateway {
	getProduct(idProduct: number): Promise<Product>;
}
