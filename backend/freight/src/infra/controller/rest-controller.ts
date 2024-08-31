import CalculateFreight from "../../application/calculate-freight";
import HttpServer from "../http/http-server";

export default class RestController {
	constructor(
		private readonly httpServer: HttpServer,
		private readonly calculateFreight: CalculateFreight
	) {}

	execute() {
		this.httpServer.on(
			"post",
			"/calculateFreight",
			async (params: any, body: any) => {
				const output = await this.calculateFreight.execute(body);
				return output;
			}
		);
	}
}
