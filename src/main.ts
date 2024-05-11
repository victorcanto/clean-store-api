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
	const productsIds = new Set();
	for (const item of items) {
		if (productsIds.has(item.idProduct)) {
			return res.status(422).json({
				message: "Duplicated product in the same order",
			});
		}
		productsIds.add(item.idProduct);
		const [product] = await connection.query(
			"select * from store.product where id_product = $1",
			[item.idProduct]
		);
		if (!product) {
			return res.status(422).json({ message: "Product not found" });
		}
		if (item.quantity <= 0) {
			return res
				.status(422)
				.json({ message: "Quantity must be positive" });
		}
		total += parseFloat(product.price) * item.quantity;
	}

	if (couponCode) {
		const [coupon] = await connection.query(
			"select * from store.coupon where code = $1",
			[couponCode]
		);
		const today = new Date();
		if (coupon && coupon.expire_date.getTime() > today.getTime()) {
			total -= total * (coupon.percentage / 100);
		}
	}
	return res.status(200).json({ message: "Success", total });
});

app.use(router);

app.listen(env.port, () => {
	console.log(`Server running on port ${env.port}`);
});
