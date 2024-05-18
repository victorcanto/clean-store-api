import Checkout from "../src/checkout";
import CouponData from "../src/coupon-data";
import { CouponModel } from "../src/coupon-model";
import CurrencyGateway from "../src/currency-gateway";
import ProductData from "../src/product-data";
import { ProductModel } from "../src/product-model";
import sinon from "sinon";

const mockCouponDataDb = (): CouponData => {
	class CouponDataDbStub implements CouponData {
		async getCoupon(code: string): Promise<CouponModel> {
			const coupons: { [code: string]: CouponModel } = {
				VALE10: {
					code: "VALE10",
					percentage: 10,
					expireDate: new Date("2025-01-01"),
				},
				VALE20: {
					code: "VALE20",
					percentage: 20,
					expireDate: new Date("2025-01-01"),
				},
				VALE50_EXPIRED: {
					code: "VALE50_EXPIRED",
					percentage: 50,
					expireDate: new Date("2024-01-01"),
				},
			};
			return Promise.resolve(coupons[code]);
		}
	}
	return new CouponDataDbStub();
};

const mockProductDataDb = (): ProductData => {
	class ProductDataDbStub implements ProductData {
		async getProduct(idProduct: number): Promise<ProductModel> {
			const products: { [idProduct: number]: ProductModel } = {
				1: {
					idProduct: 1,
					description: "A",
					price: 1000,
					width: 100,
					height: 30,
					length: 10,
					weight: 3,
					currency: "BRL",
				},
				2: {
					idProduct: 2,
					description: "B",
					price: 5000,
					width: 50,
					height: 50,
					length: 50,
					weight: 22,
					currency: "BRL",
				},
				3: {
					idProduct: 3,
					description: "C",
					price: 30,
					width: 10,
					height: 10,
					length: 10,
					weight: 0.9,
					currency: "BRL",
				},
				4: {
					idProduct: 4,
					description: "D",
					price: 100,
					width: 100,
					height: 30,
					length: 10,
					weight: 3,
					currency: "USD",
				},
			};
			return Promise.resolve(products[idProduct]);
		}
	}
	return new ProductDataDbStub();
};

type SutTypes = {
	couponDataStub: CouponData;
	productDataStub: ProductData;
	sut: Checkout;
};

const makeSut = (): SutTypes => {
	const productDataStub = mockProductDataDb();
	const couponDataStub = mockCouponDataDb();
	const sut = new Checkout(productDataStub, couponDataStub);
	return {
		couponDataStub,
		productDataStub,
		sut,
	};
};

describe("Checkout", () => {
	test("Deve fazer um pedido com 4 produtos com moedas diferentes", async () => {
		const currencyGatewayStub = sinon
			.stub(CurrencyGateway.prototype, "getCurrencies")
			.resolves({
				USD: 3,
				BRL: 1,
			});
		const { sut } = makeSut();
		const input = {
			cpf: "454.508.362-52",
			items: [
				{ idProduct: 1, quantity: 1 },
				{ idProduct: 2, quantity: 1 },
				{ idProduct: 3, quantity: 3 },
				{ idProduct: 4, quantity: 1 },
			],
		};

		const output = await sut.execute(input);
		expect(output.total).toBe(6680);
		currencyGatewayStub.restore();
	});
});
