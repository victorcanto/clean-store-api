export default interface OrderData {
	save(order: any): Promise<void>;
	getByCpf(cpf: string): Promise<any>;
	count(): Promise<number>;
}
