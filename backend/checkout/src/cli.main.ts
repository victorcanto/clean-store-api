import Checkout from "./application/checkout";
import ProductDataDb from "./infra/data/product-data-db";
import CouponDataDb from "./infra/data/coupon-data-db";
import OrderDataDb from "./infra/data/order-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import CLIController from "./infra/cli/cli-controller";
import CLIHandlerNode from "./infra/cli/cli-handler-node";

const connection = new PgPromiseConnection();
const checkout = new Checkout(
	new ProductDataDb(connection),
	new CouponDataDb(connection),
	new OrderDataDb(connection),
	new CurrencyGatewayRandom(),
	new MailerConsole()
);
const handler = new CLIHandlerNode();
const cliController = new CLIController(handler, checkout);
cliController.execute();
