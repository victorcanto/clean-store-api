import Queue from "./queue";

export default class QueueMemory implements Queue {
	observers: { queueName: string; callback: Function }[] = [];

	async connect(): Promise<void> { /* TODO document why this async method 'connect' is empty */ }
	async on(queueName: string, callback: Function): Promise<void> {
		this.observers.push({ queueName, callback });
	}
	async publish(queueName: string, data: any): Promise<void> {
		for (const observer of this.observers) {
			if (observer.queueName === queueName) {
				await observer.callback(data);
			}
		}
	}
}
