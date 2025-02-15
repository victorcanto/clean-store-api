export default class Product {
	constructor(
		readonly idProduct: number,
		readonly description: string,
		readonly price: number,
		readonly width: number,
		readonly height: number,
		readonly length: number,
		readonly weight: number,
		readonly currency = "BRL",
		readonly volume = 0,
		readonly density = 0
	) {}
}
