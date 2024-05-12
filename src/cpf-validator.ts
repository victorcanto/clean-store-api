export class CpfValidator {
	static validate(rawCpf: string): boolean {
		if (!rawCpf) return false;
		const cleanCpf = rawCpf.replace(/\D/g, "");
		if (this.isInvalidLength(cleanCpf)) return false;
		if (this.allDigitsTheSame(cleanCpf)) return false;
		const digit1 = this.calculateDigits(cleanCpf, 10);
		const digit2 = this.calculateDigits(cleanCpf, 11);
		const actualDigit = this.extractDigits(cleanCpf);
		const validatedDigit = `${digit1}${digit2}`;
		return validatedDigit === actualDigit;
	}

	private static calculateDigits(cpf: string, factor: number): number {
		let total = 0;
		for (const digit of cpf) {
			if (factor > 1) {
				total += parseInt(digit) * factor--;
			}
		}
		const rest = total % 11;
		return rest < 2 ? 0 : 11 - rest;
	}

	private static isInvalidLength(cpf: string): boolean {
		return cpf.length !== 11;
	}

	private static allDigitsTheSame(cpf: string): boolean {
		const [firstDigit] = cpf;
		return [...cpf].every((digit) => digit === firstDigit);
	}

	private static extractDigits(cpf: string): string {
		return cpf.slice(9);
	}
}
