import amqp from "amqplib";
import Checkout from "./application/checkout";
import ProductDataDb from "./infra/data/product-data-db";
import CouponDataDb from "./infra/data/coupon-data-db";
import OrderDataDb from "./infra/data/order-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import PgPromiseConnection from "./infra/db/pg-promise-connection";

const connection = new PgPromiseConnection();

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
				new ProductDataDb(connection),
				new CouponDataDb(connection),
				new OrderDataDb(connection),
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
