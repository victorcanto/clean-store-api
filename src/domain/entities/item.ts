export default class Item {
	constructor(
		readonly idProduct: number,
		readonly price: number,
		readonly quantity: number,
		readonly currencyCode = "BRL",
		readonly currencyValue = 1
	) {
		if (quantity <= 0) throw new Error("Quantity must be positive");
	}

	getTotal(): number {
		return this.price * this.quantity * this.currencyValue;
	}
}
