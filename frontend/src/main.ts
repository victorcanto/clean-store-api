import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import CheckoutGatewayHttp from "./infra/gateway/checkout-gateway-http";
import AxiosAdapter from "./infra/http/axios-adapter";

const app = createApp(App);
const httpClient = new AxiosAdapter();
const baseUrl = "http://localhost:3333";
app.provide("checkoutGateway", new CheckoutGatewayHttp(httpClient, baseUrl));
app.mount("#app");
