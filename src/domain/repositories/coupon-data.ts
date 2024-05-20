import Coupon from "../entities/coupon";

export default interface CouponData {
	getCoupon(code: string): Promise<Coupon | null>;
}
