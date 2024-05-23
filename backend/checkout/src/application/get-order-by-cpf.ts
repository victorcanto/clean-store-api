import OrderData from "../domain/repositories/order-data";

export default class GetOrderByCPf {
	constructor(private readonly orderData: OrderData) {}

	async execute(cpf: string): Promise<Output> {
		const order = await this.orderData.getByCpf(cpf);
		return {
			total: order.getTotal() || 0,
		};
	}
}

type Output = {
	total: number;
};
