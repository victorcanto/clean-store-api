import HttpClient from "./http-client";

export default class FetchAdapter implements HttpClient {
	async get(url: string): Promise<any> {
		const response = await fetch(url);
		return response.json();
	}
	async post(url: string, body: any): Promise<any> {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		};
		const response = await fetch(url, options);
		return response.json();
	}
}
