import ZipCode from "../../src/domain/entities/zipcode";
import ZipCodeData from "../../src/domain/repositories/zipcode-data";
import CalculateFreight from "../../src/application/calculate-freight";

export const fakeZipCodeData = (): ZipCodeData => {
	class ZipCodeDataStub implements ZipCodeData {
		async get(code: string): Promise<ZipCode | undefined> {
			if (code === "22030060") {
				return Promise.resolve(
					new ZipCode("22030060", "", "", -27.5945, -48.5477)
				);
			}
			if (code === "88015600") {
				return Promise.resolve(
					new ZipCode("88015600", "", "", -22.9129, -43.2003)
				);
			}
			return Promise.resolve(undefined);
		}
	}
	return new ZipCodeDataStub();
};

export const fakeCalculateFreight = (): CalculateFreight => {
	return new CalculateFreight(fakeZipCodeData());
};
