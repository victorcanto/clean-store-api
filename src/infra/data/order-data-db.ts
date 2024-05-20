import OrderData from "../../domain/repositories/order-data";
import Order from "../../domain/entities/order";
import DbConnection from "../db/db-connection";

export default class OrderDataDb implements OrderData {
	constructor(private readonly connection: DbConnection) {}

	async save(order: Order): Promise<void> {
		await this.connection.query(
			"insert into store.order (cpf, total) values ($1, $2)",
			[order.cpf.getValue(), order.getTotal()]
		);
	}
	async getByCpf(cpf: string): Promise<Order> {
		const [order] = await this.connection.query(
			"select * from store.order where cpf = $1",
			[cpf]
		);
		return order;
	}

	async count(): Promise<number> {
		const [count] = await this.connection.query(
			"select count(*) from store.order"
		);
		return count.count;
	}
}
