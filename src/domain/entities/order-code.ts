export default class OrderCode {
	private value: string;

	constructor(readonly date: Date, readonly sequence: number) {
		if (sequence < 0) throw new Error("Invalid sequence");
		const year = this.date.getFullYear();
		this.value = `${year}${this.sequence.toString().padStart(8, "0")}`;
	}

	getValue(): string {
		return this.value;
	}
}
