export default interface CurrencyGateway {
	getCurrencies(): Promise<{ [key: string]: number }>;
}
