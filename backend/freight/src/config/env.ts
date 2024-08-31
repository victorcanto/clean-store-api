export default {
	port: Number(process.env.PORT ?? 3334),
	postgreUrl:
		process.env.POSTGRES_URL ??
		"postgresql://postgres:mypgdbpass@localhost:5432/cleanstore",
};
