import Checkout from "../../application/checkout";
import HttpServer from "../http/http-server";

export default class RestController {
	constructor(
		private readonly httpServer: HttpServer,
		private readonly checkout: Checkout
	) {}

	execute() {
		this.httpServer.on(
			"get",
			"/products",
			async (params: any, body: any) => {
				const output = [
					{ idProduct: 4, description: "D", price: 1000 },
				];
				return output;
			}
		);
		this.httpServer.on(
			"post",
			"/checkout",
			async (params: any, body: any) => {
				const output = await this.checkout.execute(body);
				return output;
			}
		);
	}
}
