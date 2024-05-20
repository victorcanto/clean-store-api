import CouponData from "../../domain/repositories/coupon-data";
import Coupon from "../../domain/entities/coupon";
import DbConnection from "../db/db-connection";

export default class CouponDataDb implements CouponData {
	constructor(private readonly connection: DbConnection) {}

	async getCoupon(code: string): Promise<Coupon> {
		const [couponData] = await this.connection.query(
			"select * from store.coupon where code = $1",
			[code]
		);
		if (!couponData) throw new Error("Coupon not found");
		return new Coupon(
			couponData.code,
			parseFloat(couponData.percentage),
			couponData.expire_date
		);
	}
}
