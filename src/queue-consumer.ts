import amqp from "amqplib";
import Checkout from "./checkout";
import ProductDataDb from "./product-data-db";
import CouponDataDb from "./coupon-data-db";
import OrderDataDb from "./order-data-db";
import CurrencyGatewayRandom from "./currency-gateway-random";
import MailerConsole from "./mailer-console";

async function init() {
	const connectionQueue = await amqp.connect(
		"amqp://rabbitmq:rabbitmqpass@localhost:5672"
	);
	const channel = await connectionQueue.createChannel();
	await channel.assertQueue("checkout", { durable: true });
	await channel.consume("checkout", async (message: any) => {
		const input = JSON.parse(message.content.toString());
		try {
			const checkout = new Checkout(
				new ProductDataDb(),
				new CouponDataDb(),
				new OrderDataDb(),
				new CurrencyGatewayRandom(),
				new MailerConsole()
			);
			const output = await checkout.execute(input);
			console.log(output);
		} catch (error: any) {
			console.log(error.message);
		}

		channel.ack(message);
	});
}

init();
