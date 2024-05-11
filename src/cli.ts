import axios from "axios";
axios.defaults.validateStatus = () => true;

type Input = {
	cpf: string;
	items: { idProduct: string; quantity: number }[];
	coupon: string;
};

const input: Input = {
	cpf: "",
	items: [],
	coupon: "",
};

process.stdin.on("data", async (data) => {
	const command = data.toString().replace("\n", "");
	if (command.startsWith("set-cpf")) {
		const params = command.replace("set-cpf ", "");
		input.cpf = params;
	}

	if (command.startsWith("add-item")) {
		const params = command.replace("add-item ", "");
		const [idProduct, quantity] = params.split(" ");
		input.items.push({ idProduct, quantity: parseInt(quantity) });
	}

	if (command.startsWith("set-coupon")) {
		const params = command.replace("set-coupon ", "");
		input.coupon = params;
	}

	if (command.startsWith("checkout")) {
		const response = await axios.post(
			"http://localhost:3333/checkout",
			input
		);
		console.log(response.data);
	}

	if (command.startsWith("exit")) {
		process.exit();
	}
});
