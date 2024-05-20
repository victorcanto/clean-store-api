import Currencies from "../../domain/entities/currencies";

export default interface CurrencyGateway {
	getCurrencies(): Promise<Currencies>;
}
