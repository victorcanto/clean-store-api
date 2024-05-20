import CouponData from "../src/domain/repositories/coupon-data";
import ValidateCoupon from "../src/application/validate-coupon";
import { fakeCouponDataDb } from "./helpers/fake";

type SutTypes = {
	couponDataStub: CouponData;
	sut: ValidateCoupon;
};

const makeSut = (): SutTypes => {
	const couponDataStub = fakeCouponDataDb();
	const sut = new ValidateCoupon(couponDataStub);
	return {
		couponDataStub,
		sut,
	};
};

describe("Validate Coupon", () => {
	test("Deve chamar o CouponDataDb para validar o cupom de desconto", async () => {
		const { sut, couponDataStub } = makeSut();
		const couponDataDbSpy = jest.spyOn(couponDataStub, "getCoupon");
		await sut.execute("VALE20", 1000);
		expect(couponDataDbSpy).toHaveBeenCalledWith("VALE20");
	});

	test("Deve validar um cupom de desconto", async () => {
		const { sut } = makeSut();
		const output = await sut.execute("VALE20", 1000);
		expect(output.isExpired).toBeFalsy();
	});

	test("Deve retornar o valor de desconto", async () => {
		const { sut } = makeSut();
		const output = await sut.execute("VALE20", 1000);
		expect(output.discount).toBe(200);
	});
});
