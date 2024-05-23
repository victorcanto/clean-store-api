import Mailer from "./mailer";

export default class MailerConsole implements Mailer {
	async send(to: string, subject: string, message: string): Promise<boolean> {
		console.log({ to, subject, message });
		return true;
	}
}
