"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
var express_1 = __importDefault(require("express"));
var order_1 = require("./../application/order");
var authentication_middleware_1 = __importDefault(require("./middleware/authentication-middleware"));
exports.orderRouter = express_1.default.Router();
exports.orderRouter.route("/").post(authentication_middleware_1.default, order_1.createOrder);
exports.orderRouter.route("/:id").get(order_1.getOrder);
//getUserOrders
//# sourceMappingURL=order.js.map