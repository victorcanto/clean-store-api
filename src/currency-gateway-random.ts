import CurrencyGateway from "./currency-gateway";

export default class CurrencyGatewayRandom implements CurrencyGateway {
	async getCurrencies(): Promise<{ [key: string]: number }> {
		return {
			USD: 3 * Math.random(),
			BRL: 1,
		};
	}
}
