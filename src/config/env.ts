export default {
	port: process.env.POSTGRES_URL ?? 3333,
	postgreUrl:
		process.env.POSTGRES_URL ??
		"postgresql://postgres:mypgdbpass@localhost:5432/clean-code-arch",
};
