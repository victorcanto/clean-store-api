import CLIHandler from "./cli-handler";

export default class CLIHandlerNode extends CLIHandler {
	constructor() {
		super();
		process.stdin.on("data", (data) => {
			const text = data.toString().replace(/\n/g, "");
			this.type(text);
		});
	}

	write(text: string): void {
		console.log(text);
	}
}
