import Coupon from "../../src/domain/entities/coupon";
import Cpf from "../../src/domain/entities/cpf";
import Order from "../../src/domain/entities/order";
import Product from "../../src/domain/entities/product";
import Mockdate from "mockdate";

describe("Order", () => {
	beforeEach(() => {
		Mockdate.set(new Date());
	});

	afterEach(() => {
		Mockdate.reset();
	});

	test("Deve criar um pedido", async () => {
		const order = new Order(new Cpf("454.508.362-52"));
		expect(order.getTotal()).toBe(0);
	});

	test("Nao deve criar um pedido com cpf invalido", async () => {
		expect(() => new Order(new Cpf("111.111.111-11"))).toThrow(
			new Error("Invalid cpf")
		);
	});

	test("Deve criar um pedido com 3 itens", async () => {
		const order = new Order(new Cpf("454.508.362-52"));
		order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
		order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22, "BRL"), 1);
		order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9, "BRL"), 3);
		expect(order.getTotal()).toBe(6350);
	});

	test("Deve criar um pedido com cupom de desconto", async () => {
		const order = new Order(new Cpf("454.508.362-52"));
		order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
		order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22, "BRL"), 1);
		order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9, "BRL"), 3);
		order.addCoupon(
			new Coupon("VALE20", 20, new Date("2024-12-01T00:00:00"))
		);
		expect(order.getTotal()).toBe(5132);
	});

	test("Nao deve criar um pedido com quantidade negativa", async () => {
		const order = new Order(new Cpf("454.508.362-52"));
		expect(() =>
			order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), -1)
		).toThrow(new Error("Quantity must be positive"));
	});

	test("Nao deve criar um pedido com item duplicado", async () => {
		const order = new Order(new Cpf("454.508.362-52"));
		order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
		expect(() =>
			order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1)
		).toThrow(new Error("Duplicated product in the same order"));
	});
});

test("Deve criar um pedido com 3 itens com codigo de cupom", async () => {
	const order = new Order(new Cpf("454.508.362-52"));
	order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3, "BRL"), 1);
	order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22, "BRL"), 1);
	order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9, "BRL"), 3);
	expect(order.getCode()).toBe("202400000001");
});
