import OrderCode from "../src/domain/entities/order-code";
import Mockdate from "mockdate";

describe("OrderCode", () => {
	beforeEach(() => {
		Mockdate.set(new Date());
	});

	afterEach(() => {
		Mockdate.reset();
	});
	
	test("Deve gerar um novo codigo", () => {
		const orderCode = new OrderCode(new Date("2024-01-01T00:00:00"), 1);
		expect(orderCode.getValue()).toBe("202400000001");
	});

	test("Nao deve gerar um novo codigo se o sequence for negativo", () => {
		expect(
			() => new OrderCode(new Date("2024-01-01T00:00:00"), -1)
		).toThrow(new Error("Invalid sequence"));
	});
});
