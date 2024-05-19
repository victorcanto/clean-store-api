import { CouponModel } from "./coupon-model";

export default interface CouponData {
	getCoupon(code: string): Promise<CouponModel | null>;
}
