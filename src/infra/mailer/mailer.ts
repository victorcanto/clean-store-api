export default interface Mailer {
	send(to: string, subject: string, message: string): Promise<boolean>;
}
