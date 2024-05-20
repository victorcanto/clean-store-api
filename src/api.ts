import Checkout from "./application/checkout";
import ProductDataDb from "./infra/data/product-data-db";
import CouponDataDb from "./infra/data/coupon-data-db";
import CurrencyGatewayRandom from "./infra/gateway/currency-gateway-random";
import MailerConsole from "./infra/mailer/mailer-console";
import env from "./config/env";
import express from "express";
import OrderDataDb from "./infra/data/order-data-db";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
const app = express();

const router = express.Router();
app.use(express.json());

const connection = new PgPromiseConnection();

router.post("/checkout", async (req, res) => {
	try {
		const checkout = new Checkout(
			new ProductDataDb(connection),
			new CouponDataDb(connection),
			new OrderDataDb(connection),
			new CurrencyGatewayRandom(),
			new MailerConsole()
		);
		const output = await checkout.execute(req.body);
		return res.status(200).json(output);
	} catch (error: any) {
		res.status(422).json({ message: error.message });
	}
});

app.use(router);

app.listen(env.port, () => {
	console.log(`Server running on port ${env.port}`);
});
