import HttpServer from "./http-server";
import express, { Express, Request, Response } from "express";
import cors from "cors"

export default class ExpressHtppServer implements HttpServer {
	app: Express;

	constructor() {
		this.app = express();
		this.app.use(express.json());
		this.app.use(cors())
	}

	on(method: string, path: string, callback: Function): void {
		const expressMethod = method as keyof Express;
		this.app[expressMethod](path, async (req: Request, res: Response) => {
			try {
				const output = await callback(req.params, req.body);
				return res.json(output);
			} catch (error: any) {
				res.status(422).json({ message: error.message });
			}
		});
	}
	listen(port: number): void {
		this.app.listen(port);
	}
}
