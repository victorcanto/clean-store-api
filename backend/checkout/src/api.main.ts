import Checkout from "./application/checkout";
import CouponDataDb from "./infra/data/coupon-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import OrderDataDb from "./infra/data/order-data-db";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import ExpressHtppServer from "./infra/http/express-http-server";
import RestController from "./infra/controller/rest-controller";
import env from "./config/env";
import FreightGatewayHttp from "./infra/gateway/freight-gateway-http";
import CatalogGatewayHttp from "./infra/gateway/catalog-gateway-http";

const connection = new PgPromiseConnection();
const httpServer = new ExpressHtppServer();
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
const restController = new RestController(httpServer, checkout);
restController.execute();
httpServer.listen(env.port);
