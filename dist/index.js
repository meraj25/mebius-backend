"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var product_1 = __importDefault(require("./api/product"));
var category_1 = __importDefault(require("./api/category"));
var review_1 = __importDefault(require("./api/review"));
var index_1 = __importDefault(require("./infrastructure/db/index"));
var global_error_handling_middleware_1 = __importDefault(require("./api/middleware/global-error-handling-middleware"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var order_1 = require("./api/order");
var express_2 = require("@clerk/express");
var payment_1 = require("./api/payment");
var payment_2 = require("./application/payment");
var app = (0, express_1.default)();
app.post("/api/stripe/webhook", body_parser_1.default.raw({ type: "application/json" }), payment_2.handleWebhook);
// Middleware to parse JSON bodies
app.use(express_1.default.json()); //It conversts the incomign json payload of a  request into a javascript object found in req.body
app.use((0, express_2.clerkMiddleware)());
app.use((0, cors_1.default)({ origin: "https://mebius-frontend-meraj.netlify.app" }));
app.use("/api/products", product_1.default);
app.use("/api/categories", category_1.default);
app.use("/api/reviews", review_1.default);
app.use("/api/orders", order_1.orderRouter);
app.use("/api/payments", payment_1.paymentsRouter);
app.use(global_error_handling_middleware_1.default);
(0, index_1.default)();
var PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
//# sourceMappingURL=index.js.map