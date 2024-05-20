import pgPromise from "pg-promise";
import Connection from "./db-connection";
import env from "../../config/env";

export default class PgPromiseConnection implements Connection {
	private pgp: any;

	constructor() {
		this.pgp = pgPromise()(env.postgreUrl);
	}

	async query(statement: string, params: any[]): Promise<any> {
		return this.pgp.query(statement, params);
	}

	async close(): Promise<void> {
		await this.pgp.$pool.end();
	}
}
