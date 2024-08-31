import Checkout from "./application/checkout";
import CouponDataDb from "./infra/data/coupon-data-db";
import OrderDataDb from "./infra/data/order-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import CLIController from "./infra/cli/cli-controller";
import CLIHandlerNode from "./infra/cli/cli-handler-node";
import FreightGatewayHttp from "./infra/gateway/freight-gateway-http";
import CatalogGatewayHttp from "./infra/gateway/catalog-gateway-http";

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
const handler = new CLIHandlerNode();
const cliController = new CLIController(handler, checkout);
cliController.execute();
