import Checkout from "./application/checkout";
import ProductDataDb from "./infra/data/product-data-db";
import CouponDataDb from "./infra/data/coupon-data-db";
import OrderDataDb from "./infra/data/order-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import CLIController from "./infra/cli/cli-controller";
import CLIHandlerNode from "./infra/cli/cli-handler-node";
import ZipCodeDataDb from "./infra/data/zipcode-data-db";
import CalculateFreight from "./application/calculate-freight";

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
const handler = new CLIHandlerNode();
const cliController = new CLIController(handler, checkout);
cliController.execute();
