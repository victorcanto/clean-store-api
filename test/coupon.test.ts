import Coupon from "../src/domain/entities/coupon";

describe("Coupon", () => {
	test("Deve testar se o cupom esta valido", () => {
		const coupon = new Coupon("VALE20", 20, new Date());
		expect(coupon.isExpired()).toBeFalsy();
	});

	test("Deve testar se o cupom esta expirado", () => {
		const coupon = new Coupon(
			"VALE20",
			20,
			new Date("2024-01-01T10:00:00")
		);
		expect(coupon.isExpired()).toBeTruthy();
	});

	test("Deve testar se o valor do desconto esta correto", () => {
		const coupon = new Coupon(
			"VALE50",
			50,
			new Date("2024-01-01T10:00:00")
		);
		expect(coupon.getDiscount(1000)).toBe(500);
	});
});
