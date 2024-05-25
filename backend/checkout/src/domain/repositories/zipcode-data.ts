import ZipCode from "../entities/zipcode";

export default interface ZipCodeData {
	get(code: string): Promise<ZipCode | undefined>;
}
