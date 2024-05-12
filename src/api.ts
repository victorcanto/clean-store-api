import Checkout from "./checkout";
import env from "./config/env";
import express from "express";
import ProductDataDb from "./product-data-db";
import CouponDataDb from "./coupon-data-db";
const app = express();

const router = express.Router();
app.use(express.json());

router.post("/checkout", async (req, res) => {
	try {
		const checkout = new Checkout(new ProductDataDb(), new CouponDataDb());
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
