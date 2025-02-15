import Checkout from "../../src/application/checkout";
import CLIController from "../../src/infra/cli/cli-controller";
import CLIHandler from "../../src/infra/cli/cli-handler";
import CLIHandlerMemory from "../../src/infra/cli/cli-handler-memory";
import CouponDataDb from "../../src/infra/data/coupon-data-db";
import OrderDataDb from "../../src/infra/data/order-data-db";
import PgPromiseConnection from "../../src/infra/db/pg-promise-connection";
import CurrencyGatewayRandom from "../../src/infra/gateway/currency-gateway-random";
import MailerConsole from "../../src/infra/mailer/mailer-console";
import FreightGatewayHttp from "../../src/infra/gateway/freight-gateway-http";
import CatalogGatewayHttp from "../../src/infra/gateway/catalog-gateway-http";
import axios from "axios";
import sinon from "sinon";

axios.defaults.validateStatus = () => true;
const connection = new PgPromiseConnection();

type SutTypes = {
	checkout: Checkout;
	handler: CLIHandler;
	sut: CLIController;
};

const makeSut = (): SutTypes => {
	const catalogGateway = new CatalogGatewayHttp();
	const couponDataDb = new CouponDataDb(connection);
	const orderDataDb = new OrderDataDb(connection);
	const freightGateway = new FreightGatewayHttp();
	const currencyGatewayRandom = new CurrencyGatewayRandom();
	const mailerConsole = new MailerConsole();

	const checkout = new Checkout(
		catalogGateway,
		couponDataDb,
		orderDataDb,
		freightGateway,
		currencyGatewayRandom,
		mailerConsole
	);
	const handler = new CLIHandlerMemory();
	const sut = new CLIController(handler, checkout);

	return {
		checkout,
		handler,
		sut,
	};
};

describe("CLI", () => {
	test("Deve retornar o código e total do pedido", async () => {
		const { checkout, handler, sut } = makeSut();
		sut.execute();
		const checkoutSpy = sinon.spy(checkout, "execute");
		await handler.type("set-cpf 454.508.362-52");
		await handler.type("add-item 1 1");
		await handler.type("set-email iamvictorcanto@gmail.com");
		await handler.type("checkout");
		const [returnValue] = checkoutSpy.returnValues;
		const output = await returnValue;
		expect(output.code).toBe("202400000001");
		expect(output.total).toBe(1030);
		checkoutSpy.restore();
	});

	test("Deve retornar o código e total do pedido com o cupom", async () => {
		const { checkout, handler, sut } = makeSut();
		sut.execute();
		const checkoutSpy = sinon.spy(checkout, "execute");
		await handler.type("set-cpf 454.508.362-52");
		await handler.type("add-item 1 1");
		await handler.type("set-email iamvictorcanto@gmail.com");
		await handler.type("set-coupon VALE10");
		await handler.type("checkout");
		const [returnValue] = checkoutSpy.returnValues;
		const output = await returnValue;
		expect(output.code).toBe("202400000001");
		expect(output.total).toBe(930);
		checkoutSpy.restore();
	});
});
