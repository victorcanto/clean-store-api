import pgPromise from "pg-promise";
import env from "./config/env";
import CouponData from "./coupon-data";
import { CouponModel } from "./coupon-model";

export default class CouponDataDb implements CouponData {
	async getCoupon(code: string): Promise<CouponModel | null> {
		const connection = pgPromise()(env.postgreUrl);
		const [coupon] = await connection.query(
			"select * from store.coupon where code = $1",
			[code]
		);
		await connection.$pool.end();
		if (!coupon) return null;
		const couponData: CouponModel = {
			code: coupon.code,
			percentage: parseFloat(coupon.percentage),
			expireDate: coupon.expire_date,
		};
		return couponData;
	}
}
