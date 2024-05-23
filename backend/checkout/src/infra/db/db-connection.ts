export default interface DbConnection {
	query(statement: string, params?: any): Promise<any>;
	close(): Promise<void>;
}
