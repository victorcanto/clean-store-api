import { sleep } from "../../src/helpers/sleep";
import { describe, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import AppVue from "../../src/App.vue";
import CheckoutGatewayHttp from "../../src/infra/gateway/checkout-gateway-http";
import AxiosAdapter from "../../src/infra/http/axios-adapter";
import axios from "axios";

axios.defaults.validateStatus = () => true;

describe("App", () => {
	test("Deve ter um pedido vazio", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		expect(wrapper.get(".title").text()).toBe("Checkout");
		expect(wrapper.findAll(".product-description")[0].text()).toBe("A");
		expect(wrapper.findAll(".product-price")[0].text()).toBe("$1,000.00");
		expect(wrapper.findAll(".product-description")[1].text()).toBe("B");
		expect(wrapper.findAll(".product-price")[1].text()).toBe("$5,000.00");
		expect(wrapper.findAll(".product-description")[2].text()).toBe("C");
		expect(wrapper.findAll(".product-price")[2].text()).toBe("$30.00");
		expect(wrapper.get(".total").text()).toBe("$0.00");
	});

	test("Deve ter um pedido com 1 item", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		await wrapper.findAll(".product-add-button")[0].trigger("click");
		expect(wrapper.get(".total").text()).toBe("$1,000.00");
		expect(wrapper.findAll(".item-description")[0].text()).toBe("A");
		expect(wrapper.findAll(".item-quantity")[0].text()).toBe("1");
	});

	test("Deve ter um pedido com varios items e quantidade acima de 1", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		await wrapper.findAll(".product-add-button")[0].trigger("click");
		await wrapper.findAll(".product-add-button")[1].trigger("click");
		await wrapper.findAll(".product-add-button")[2].trigger("click");
		await wrapper.findAll(".product-add-button")[2].trigger("click");
		await wrapper.findAll(".product-add-button")[2].trigger("click");
		expect(wrapper.get(".total").text()).toBe("$6,090.00");
		expect(wrapper.findAll(".item-description")[0].text()).toBe("A");
		expect(wrapper.findAll(".item-quantity")[0].text()).toBe("1");
		expect(wrapper.findAll(".item-description")[1].text()).toBe("B");
		expect(wrapper.findAll(".item-quantity")[1].text()).toBe("1");
		expect(wrapper.findAll(".item-description")[2].text()).toBe("C");
		expect(wrapper.findAll(".item-quantity")[2].text()).toBe("3");
	});

	test("Deve ter um pedido com varios items e decrementar a quantidade do item do pedido", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		await wrapper.findAll(".product-add-button")[0].trigger("click");
		await wrapper.findAll(".product-add-button")[1].trigger("click");
		await wrapper.findAll(".product-add-button")[2].trigger("click");
		await wrapper.findAll(".product-add-button")[2].trigger("click");
		await wrapper.findAll(".product-add-button")[2].trigger("click");
		await wrapper.findAll(".item-decrease-button")[2].trigger("click");
		await wrapper.findAll(".item-decrease-button")[2].trigger("click");
		expect(wrapper.get(".total").text()).toBe("$6,030.00");
		expect(wrapper.findAll(".item-quantity")[2].text()).toBe("1");
	});

	test("Deve ter um pedido com varios items e incrementar a quantidade do item do pedido", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		await wrapper.findAll(".product-add-button")[0].trigger("click");
		expect(wrapper.get(".total").text()).toBe("$1,000.00");
		expect(wrapper.findAll(".item-quantity")[0].text()).toBe("1");
		await wrapper.findAll(".item-increase-button")[0].trigger("click");
		await wrapper.findAll(".item-increase-button")[0].trigger("click");
		expect(wrapper.get(".total").text()).toBe("$3,000.00");
		expect(wrapper.findAll(".item-quantity")[0].text()).toBe("3");
	});

	test("Deve ter um pedido com varios items e decrementar a quantidade do item do pedido e nao permitir que a quantidade seja negativa", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		await wrapper.findAll(".product-add-button")[0].trigger("click");
		await wrapper.findAll(".item-decrease-button")[0]?.trigger("click");
		await wrapper.findAll(".item-decrease-button")[0]?.trigger("click");
		expect(wrapper.findAll(".item-quantity")[0]?.text()).toBeUndefined();
		expect(wrapper.get(".total").text()).toBe("$0.00");
	});

	test("Deve confirmar um pedido com um item", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		await wrapper.findAll(".product-add-button")[0].trigger("click");
		await wrapper.get(".confirm").trigger("click");
		await sleep(1000);
		expect(wrapper.get(".message").text()).toBe("Success");
		expect(wrapper.get(".order-code").text()).toBe("202400000001");
		expect(wrapper.get(".order-total").text()).toBe("$1,030.00");
	});

	test("Deve ter um 4 produtos", async () => {
		const httpClient = new AxiosAdapter();
		const baseUrl = "http://localhost:3333";
		const checkoutGateway = new CheckoutGatewayHttp(httpClient, baseUrl);
		const wrapper = mount(AppVue, {
			global: {
				provide: {
					checkoutGateway,
				},
			},
		});
		await sleep(1000);
		expect(wrapper.get(".title").text()).toBe("Checkout");
		expect(wrapper.findAll(".product-description")[0].text()).toBe("A");
		expect(wrapper.findAll(".product-price")[0].text()).toBe("$1,000.00");
		expect(wrapper.findAll(".product-description")[1].text()).toBe("B");
		expect(wrapper.findAll(".product-price")[1].text()).toBe("$5,000.00");
		expect(wrapper.findAll(".product-description")[2].text()).toBe("C");
		expect(wrapper.findAll(".product-price")[2].text()).toBe("$30.00");
		expect(wrapper.findAll(".product-description")[3].text()).toBe("D");
		expect(wrapper.findAll(".product-price")[3].text()).toBe("$1,000.00");
	});
});
