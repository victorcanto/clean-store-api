import ProductDataDb from "./infra/data/product-data-db";
import PgPromiseConnection from "./infra/db/pg-promise-connection";
import ExpressHtppServer from "./infra/http/express-http-server";
import RestController from "./infra/controller/rest-controller";
import env from "./config/env";
import GetProduct from "./application/get-product";
import GetAllProducts from "./application/get-all-products";

const connection = new PgPromiseConnection();
const httpServer = new ExpressHtppServer();
const productDataDb = new ProductDataDb(connection);
const getProduct = new GetProduct(productDataDb);
const getAllProducts = new GetAllProducts(productDataDb);
const restController = new RestController(
	httpServer,
	getProduct,
	getAllProducts
);
restController.execute();
httpServer.listen(env.port);
