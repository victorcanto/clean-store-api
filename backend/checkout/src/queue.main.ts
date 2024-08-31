import Checkout from "./application/checkout";
import CouponDataDb from "./infra/data/coupon-data-db";
import OrderDataDb from "./infra/data/order-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import RabbitMQAdapter from "./infra/queue/rabbit-mq-adapter";
import QueueController from "./infra/queue/queue-controller";
import FreightGatewayHttp from "./infra/gateway/freight-gateway-http";
import CatalogGatewayHttp from "./infra/gateway/catalog-gateway-http";

async function init() {
	const queue = new RabbitMQAdapter();
	await queue.connect();
	const connection = new PgPromiseConnection();
	const catalogGateway = new CatalogGatewayHttp();
	const couponDataDb = new CouponDataDb(connection);
	const orderDataDb = new OrderDataDb(connection);
	const freightGateway = new FreightGatewayHttp();
	const currencyGatewayRandom = new CurrencyGatewayRandom();
	const mailerConsole = new MailerConsole();
	
	const checkout = new Checkout(
		catalogGateway,
		couponDataDb,
		orderDataDb,
		freightGateway,
		currencyGatewayRandom,
		mailerConsole
	);
	const queueController = new QueueController(queue, checkout);
	queueController.execute();
}
init();
