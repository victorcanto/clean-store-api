import pgPromise from "pg-promise";
import OrderData from "./order-data";
import env from "./config/env";

export default class OrderDataDb implements OrderData {
	async save(order: any): Promise<void> {
		const connection = pgPromise()(env.postgreUrl);
		await connection.query(
			"insert into store.order (cpf, total) values ($1, $2)",
			[order.cpf, order.total]
		);
		await connection.$pool.end();
	}
	async getByCpf(cpf: string): Promise<any> {
		const connection = pgPromise()(env.postgreUrl);
		const [order] = await connection.query(
			"select * from store.order where cpf = $1",
			[cpf]
		);
		await connection.$pool.end();
		return order;
	}

	async count(): Promise<number> {
		const connection = pgPromise()(env.postgreUrl);
		const [count] = await connection.query(
			"select count(*) from store.order"
		);
		await connection.$pool.end();
		return count.count;
	}
}
