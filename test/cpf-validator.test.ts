import { CpfValidator } from "../src/domain/entities/cpf-validator";

const validCpfs = [
	"454.508.362-52",
	"783.916.609-15",
	"170.598.601-34",
	"545.482.777-06",
	"337.311.153-60",
	"564.201.508-76",
	"716.012.656-46",
	"541.701.122-37",
	"606.468.947-14",
	"777.866.447-09",
];

const invalidCpfs = [
	"111.111.111-11",
	"222.222.222-22",
	"333.333.333-33",
	"444.444.444-44",
	"555.555.555-55",
	"666.666.666-66",
	"777.777.777-77",
	"888.888.888-88",
	"999.999.999-99",
	"123.456.789-10",
	"234.244.544-55",
	"978.375.349-00",
];

describe("CPF Validator", () => {
	test.each(validCpfs)("Valido: %s", (cpf) => {
		expect(CpfValidator.validate(cpf)).toBeTruthy();
	});

	test.each(invalidCpfs)("Invalido: %s", (cpf) => {
		expect(CpfValidator.validate(cpf)).toBeFalsy();
	});
});
