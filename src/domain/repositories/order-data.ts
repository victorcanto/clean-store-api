import Order from "../entities/order";

export default interface OrderData {
	save(order: Order): Promise<void>;
	getByCpf(cpf: string): Promise<Order>;
	count(): Promise<number>;
}
