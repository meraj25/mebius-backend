import express from "express";
import { createOrder, getOrder, getAllOrders,getOrderCounts} from "./../application/order";
import isAuthenticated from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter.route("/").get(getAllOrders).post(isAuthenticated, createOrder);
orderRouter.route("/counts").get(getOrderCounts);
orderRouter.route("/:id").get(getOrder);




