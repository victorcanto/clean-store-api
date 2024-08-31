export default {
	port: Number(process.env.PORT ?? 3333),
	postgreUrl:
		process.env.POSTGRES_URL ??
		"postgresql://postgres:mypgdbpass@localhost:5432/cleanstore",
};
