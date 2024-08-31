import PgPromiseConnection from "./infra/db/pg-promise-connection";
import ExpressHtppServer from "./infra/http/express-http-server";
import RestController from "./infra/controller/rest-controller";
import CalculateFreight from "./application/calculate-freight";
import ZipCodeDataDb from "./infra/data/zipcode-data-db";
import env from "./config/env";

const connection = new PgPromiseConnection();
const httpServer = new ExpressHtppServer();

const zipCodeDataDb = new ZipCodeDataDb(connection);
const calculateFreight = new CalculateFreight(zipCodeDataDb);
const restController = new RestController(httpServer, calculateFreight);
restController.execute();
httpServer.listen(env.port);
