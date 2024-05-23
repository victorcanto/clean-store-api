import Checkout from "../../application/checkout";
import Queue from "./queue";

export default class QueueController {
	constructor(
		private readonly queue: Queue,
		private readonly checkout: Checkout
	) {}

	execute() {
		this.queue.on("checkout", async (input: any) => {
			await this.checkout.execute(input);
		});
	}
}
