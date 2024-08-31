export default interface HttpServer {
	on(method: string, path: string, callback: Function): void;
	listen(port: number): void;
}
