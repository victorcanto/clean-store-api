import Checkout from "../../application/checkout";
import CLIHandler from "./cli-handler";

export default class CLIController {
	constructor(
		private readonly handler: CLIHandler,
		private readonly checkout: Checkout
	) {}

	async execute() {
		const input: any = {
			cpf: "",
			email: "",
			items: [],
			coupon: "",
		};

		this.handler.on("set-cpf", (params: string) => {
			input.cpf = params;
		});

		this.handler.on("add-item", (params: string) => {
			const [idProduct, quantity] = params.split(" ");
			input.items.push({
				idProduct: Number(idProduct),
				quantity: Number(quantity),
			});
		});

		this.handler.on("set-coupon", (params: string) => {
			input.coupon = params;
		});

		this.handler.on("set-email", (params: string) => {
			input.email = params;
		});

		this.handler.on("checkout", async () => {
			const output = await this.checkout.execute(input);
			this.handler.write(JSON.stringify(output));
		});

		this.handler.on("exit", () => {
			process.exit();
		});
	}
}
