import Checkout from "./application/checkout";
import ProductDataDb from "./infra/data/product-data-db";
import CouponDataDb from "./infra/data/coupon-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import OrderDataDb from "./infra/data/order-data-db";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import ExpressHtppServer from "./infra/http/express-http-server";
import RestController from "./infra/controller/rest-controller";
import CalculateFreight from "./application/calculate-freight";
import ZipCodeDataDb from "./infra/data/zipcode-data-db";

const connection = new PgPromiseConnection();
const httpServer = new ExpressHtppServer();
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
const restController = new RestController(httpServer, checkout);
restController.execute();
httpServer.listen(3333);
