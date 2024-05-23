import CouponData from "../domain/repositories/coupon-data";

export default class ValidateCoupon {
	constructor(private readonly couponData: CouponData) {}

	async execute(code: string, total: number): Promise<Output> {
		const coupon = await this.couponData.getCoupon(code);
		if (!coupon) throw new Error("Coupon not found");
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
