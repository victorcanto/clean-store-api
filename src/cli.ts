import Checkout, { type CheckoutInput } from "./checkout";
import ProductDataDb from "./product-data-db";
import CouponDataDb from "./coupon-data-db";
import axios from "axios";
import OrderDataDb from "./order-data-db";
import CurrencyGatewayRandom from "./currency-gateway-random";
import MailerConsole from "./mailer-console";

axios.defaults.validateStatus = () => true;

const input: CheckoutInput = {
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
		input.items.push({
			idProduct: parseInt(idProduct),
			quantity: parseInt(quantity),
		});
	}

	if (command.startsWith("set-coupon")) {
		const params = command.replace("set-coupon ", "");
		input.coupon = params;
	}

	if (command.startsWith("checkout")) {
		try {
			const checkout = new Checkout(
				new ProductDataDb(),
				new CouponDataDb(),
				new OrderDataDb(),
				new CurrencyGatewayRandom(),
				new MailerConsole()
			);
			const output = await checkout.execute(input);
			console.log(output.total);
			return output.total;
		} catch (error: any) {
			console.log(error.message);
		}
	}

	if (command.startsWith("exit")) {
		process.exit();
	}
});
