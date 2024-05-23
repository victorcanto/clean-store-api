import Order from "../../src/domain/entities/order";
import Product from "../../src/domain/entities/product";
import { describe, test, expect } from "vitest";

describe("Order", () => {
	test("Deve criar um pedido vazio", () => {
		const order = new Order("111.111.111-11");
		expect(order.getTotal()).toBe(0);
	});

	test("Deve criar um pedido com 3 itens", () => {
		const order = new Order("111.111.111-11");
		order.addItem(new Product(1, "A", 1000));
        order.addItem(new Product(2, "B", 5000));
        order.addItem(new Product(3, "C", 30));
		expect(order.getTotal()).toBe(6030);
	});

    test("Deve criar um pedido com varios itens iguais", () => {
		const order = new Order("111.111.111-11");
		order.addItem(new Product(1, "A", 1000));
        order.addItem(new Product(1, "A", 1000));
        order.addItem(new Product(1, "A", 1000));
		expect(order.getTotal()).toBe(3000);
        expect(order.items).toHaveLength(1);
        expect(order.items[0].quantity).toBe(3);
	});
});
