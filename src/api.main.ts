import Checkout from "./application/checkout";
import ProductDataDb from "./infra/data/product-data-db";
import CouponDataDb from "./infra/data/coupon-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import OrderDataDb from "./infra/data/order-data-db";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import ExpressHtppServer from "./infra/http/express-http-server";
import RestController from "./infra/controller/rest-controller";

const connection = new PgPromiseConnection();
const httpServer = new ExpressHtppServer();
const checkout = new Checkout(
	new ProductDataDb(connection),
	new CouponDataDb(connection),
	new OrderDataDb(connection),
	new CurrencyGatewayRandom(),
	new MailerConsole()
);
const restController = new RestController(httpServer, checkout);
restController.execute();
httpServer.listen(3333);
