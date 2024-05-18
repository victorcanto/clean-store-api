export default class CurrencyGateway {
	async getCurrencies(): Promise<{ [key: string]: number }> {
		return {
			USD: 3,
			BRL: 1,
		};
	}
}
