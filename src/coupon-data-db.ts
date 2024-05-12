import pgPromise from "pg-promise";
import env from "./config/env";
import CouponData from "./coupon-data";

export default class CouponDataDb implements CouponData {
	async getCoupon(code: string): Promise<any> {
		const connection = pgPromise()(env.postgreUrl);
		const [coupon] = await connection.query(
			"select * from store.coupon where code = $1",
			[code]
		);
		await connection.$pool.end();
		return coupon;
	}
}
