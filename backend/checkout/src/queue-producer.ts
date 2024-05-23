import amqp from "amqplib";

async function init() {
	const connection = await amqp.connect("amqp://rabbitmq:rabbitmqpass@localhost:5672");
	const channel = await connection.createChannel();
	await channel.assertQueue("checkout", { durable: true });
	const input = {
		cpf: "454.508.362-52",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 },
		],
	};
	channel.sendToQueue("checkout", Buffer.from(JSON.stringify(input)));
}

init();
