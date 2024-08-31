import GetAllProducts from "../../application/get-all-products";
import GetProduct from "../../application/get-product";
import HttpServer from "../http/http-server";

export default class RestController {
	constructor(
		private readonly httpServer: HttpServer,
		private readonly getProduct: GetProduct,
		private readonly getAllProducts: GetAllProducts
	) {}

	execute() {
		this.httpServer.on(
			"get",
			"/products",
			async (params: any, body: any) => {
				const output = await this.getAllProducts.execute();
				return output;
			}
		);

		this.httpServer.on(
			"get",
			"/products/:idProduct",
			async (params: any, body: any) => {
				const output = await this.getProduct.execute(params.idProduct);
				return output;
			}
		);
	}
}
