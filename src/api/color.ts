import express from "express";
import isAuthenticated from "./middleware/authentication-middleware";
import { getAllColors,createColor } from "../application/color";

const colorRouter = express.Router();

colorRouter.route("/").get(getAllColors).post( createColor);

export default colorRouter;