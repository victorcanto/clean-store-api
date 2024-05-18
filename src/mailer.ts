export default class Mailer {
	async send(to: string, subject: string, message: string): Promise<void> {
		console.log("Enviando email para: ", to);
		console.log(`Assunto: ${subject}`);
		console.log(`Mensagem: ${message}`);
	}
}
