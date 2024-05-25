import CalculateFreight from "../../src/application/calculate-freight";
import Checkout from "../../src/application/checkout";
import CouponDataDb from "../../src/infra/data/coupon-data-db";
import OrderDataDb from "../../src/infra/data/order-data-db";
import ProductDataDb from "../../src/infra/data/product-data-db";
import ZipCodeDataDb from "../../src/infra/data/zipcode-data-db";
import PgPromiseConnection from "../../src/infra/db/pg-promise-connection";
import CurrencyGatewayRandom from "../../src/infra/gateway/currency-gateway-random";
import MailerConsole from "../../src/infra/mailer/mailer-console";
import Queue from "../../src/infra/queue/queue";
import QueueController from "../../src/infra/queue/queue-controller";
import QueueMemory from "../../src/infra/queue/queue-memory";
import axios from "axios";
import sinon from "sinon";

axios.defaults.validateStatus = () => true;
const connection = new PgPromiseConnection();

type SutTypes = {
	checkout: Checkout;
	queue: Queue;
	sut: QueueController;
};

const makeSut = (): SutTypes => {
	const productDataDb = new ProductDataDb(connection);
	const couponDataDb = new CouponDataDb(connection);
	const orderDataDb = new OrderDataDb(connection);
	const zipCodeDataDb = new ZipCodeDataDb(connection);
	const calculateFreight = new CalculateFreight(productDataDb, zipCodeDataDb);
	const currencyGatewayRandom = new CurrencyGatewayRandom();
	const mailerConsole = new MailerConsole();
	const checkout = new Checkout(
		productDataDb,
		couponDataDb,
		orderDataDb,
		calculateFreight,
		currencyGatewayRandom,
		mailerConsole
	);
	const queue = new QueueMemory();
	const sut = new QueueController(queue, checkout);

	return {
		checkout,
		queue,
		sut,
	};
};

describe("Queue", () => {
	test("Deve retornar o código e total do pedido", async () => {
		const { checkout, queue, sut } = makeSut();
		sut.execute();
		const checkoutSpy = sinon.spy(checkout, "execute");
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
			],
		};
		await queue.publish("checkout", input);
		const [returnValue] = checkoutSpy.returnValues;
		const output = await returnValue;
		expect(output.code).toBe("202400000001");
		expect(output.total).toBe(6370);
		checkoutSpy.restore();
	});

	test("Deve retornar o código e total do pedido com o cupom", async () => {
		const { checkout, queue, sut } = makeSut();
		sut.execute();
		const checkoutSpy = sinon.spy(checkout, "execute");
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
			],
			coupon: "VALE10",
		};
		await queue.publish("checkout", input);
		const [returnValue] = checkoutSpy.returnValues;
		const output = await returnValue;
		expect(output.code).toBe("202400000001");
		expect(output.total).toBe(5761);
		checkoutSpy.restore();
	});
});
