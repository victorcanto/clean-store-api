import axios from "axios";
import FreightGateway from "./freight-gateway";

export default class FreightGatewayHttp implements FreightGateway {
	async calculateFreight(
		items: { volume: number; density: number; quantity: number }[],
		from?: string | undefined,
		to?: string | undefined
	): Promise<{ total: number }> {
		const response = await axios.post(
			"http://localhost:3334/calculateFreight",
			{
				items,
				from,
				to,
			}
		);
		return response.data;
	}
}
