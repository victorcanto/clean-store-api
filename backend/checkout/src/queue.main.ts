import Checkout from "./application/checkout";
import ProductDataDb from "./infra/data/product-data-db";
import CouponDataDb from "./infra/data/coupon-data-db";
import OrderDataDb from "./infra/data/order-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import RabbitMQAdapter from "./infra/queue/rabbit-mq-adapter";
import QueueController from "./infra/queue/queue-controller";
import ZipCodeDataDb from "./infra/data/zipcode-data-db";
import CalculateFreight from "./application/calculate-freight";

async function init() {
	const queue = new RabbitMQAdapter();
	await queue.connect();
	const connection = new PgPromiseConnection();
	const productDataDb = new ProductDataDb(connection);
	const couponDataDb = new CouponDataDb(connection);
	const orderDataDb = new OrderDataDb(connection);
	const zipCodeDataDb = new ZipCodeDataDb(connection);
	const calculateFreight = new CalculateFreight(productDataDb, zipCodeDataDb);
	const currencyGatewayRandom = new CurrencyGatewayRandom();
	const mailerConsole = new MailerConsole();
	const checkout = new Checkout(
		productDataDb,
		couponDataDb,
		orderDataDb,
		calculateFreight,
		currencyGatewayRandom,
		mailerConsole
	);
	const queueController = new QueueController(queue, checkout);
	queueController.execute();
}
init();
