import ZipCode from "../../domain/entities/zipcode";
import ZipCodeData from "../../domain/repositories/zipcode-data";
import DbConnection from "../db/db-connection";

export default class ZipCodeDataDb implements ZipCodeData {
	constructor(private readonly connection: DbConnection) {}

	async get(code: string): Promise<ZipCode | undefined> {
		const [zipCodeData] = await this.connection.query(
			"select * from store.zipcode where code = $1",
			[code]
		);
		if (!zipCodeData) return;
		return Promise.resolve(
			new ZipCode(
				zipCodeData.code,
				zipCodeData.street,
				zipCodeData.neighborhood,
				parseFloat(zipCodeData.lat),
				parseFloat(zipCodeData.long)
			)
		);
	}
}
