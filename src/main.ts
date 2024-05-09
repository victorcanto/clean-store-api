import express from "express";
import pgp from "pg-promise";
import { CpfValidator } from "./cpf-validator";
import env from "./config/env";
const app = express();

const connection = pgp()(env.postgreUrl);

const router = express.Router();
app.use(express.json());

router.post("/checkout", async (req, res) => {
	const { cpf, items, coupon: couponCode } = req.body;
	const isValidCpf = new CpfValidator().validate(cpf);
	if (!isValidCpf) {
		return res.status(422).json({ message: "Invalid cpf" });
	}
	let total = 0;
	for (const item of items) {
		const [product] = await connection.query(
			"select * from store.product where id_product = $1",
			[item.idProduct]
		);
		if (!product) {
			return res.status(422).json({ message: "Product not found" });
		}
		total += parseFloat(product.price) * item.quantity;
	}

	if (couponCode) {
		const [coupon] = await connection.query(
			"select * from store.coupon where code = $1",
			[couponCode]
		);
		if (!coupon) {
			return res.status(422).json({ message: "Coupon not found" });
		}
		total -= total * (coupon.percentage / 100);
	}
	return res.status(200).json({ message: "Success", total });
});

app.use(router);

app.listen(env.port, () => {
	console.log(`Server running on port ${env.port}`);
});
