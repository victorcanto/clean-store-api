import Coupon from "./coupon";
import CouponData from "./coupon-data";

export default class ValidateCoupon {
	constructor(private readonly couponData: CouponData) {}

	async execute(code: string, total: number): Promise<Output> {
		const couponData = await this.couponData.getCoupon(code);
		if (!couponData) {
			throw new Error("Coupon not found");
		}
		const coupon = new Coupon(
			couponData.code,
			couponData.percentage,
			couponData.expireDate
		);
		return {
			isExpired: coupon.isExpired(),
			discount: coupon.getDiscount(total),
		};
	}
}

type Output = {
	isExpired: boolean;
	discount: number;
};
