"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveSessionStatus = exports.createCheckoutSession = exports.handleWebhook = void 0;
var util_1 = __importDefault(require("util"));
var Order_1 = __importDefault(require("../infrastructure/db/entities/Order"));
var stripe_1 = __importDefault(require("../infrastructure/stripe"));
var Product_1 = __importDefault(require("../infrastructure/db/entities/Product"));
var endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
var FRONTEND_URL = process.env.FRONTEND_URL;
function fulfillCheckout(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var checkoutSession, order;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Fulfilling Checkout Session " + sessionId);
                    return [4 /*yield*/, stripe_1.default.checkout.sessions.retrieve(sessionId, {
                            expand: ["line_items"],
                        })];
                case 1:
                    checkoutSession = _b.sent();
                    console.log(util_1.default.inspect(checkoutSession, false, null, true /* enable colors */));
                    return [4 /*yield*/, Order_1.default.findById((_a = checkoutSession.metadata) === null || _a === void 0 ? void 0 : _a.orderId).populate("items.productId")];
                case 2:
                    order = _b.sent();
                    if (!order) {
                        throw new Error("Order not found");
                    }
                    if (order.paymentStatus !== "PENDING") {
                        throw new Error("Payment is not pending");
                    }
                    if (order.orderStatus !== "PENDING") {
                        throw new Error("Order is not pending");
                    }
                    if (!(checkoutSession.payment_status !== "unpaid")) return [3 /*break*/, 4];
                    // Perform fulfillment of the line items
                    order.items.forEach(function (item) { return __awaiter(_this, void 0, void 0, function () {
                        var product;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    product = item.productId;
                                    return [4 /*yield*/, Product_1.default.findByIdAndUpdate(product._id, {
                                            $inc: { stock: -item.quantity },
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Order_1.default.findByIdAndUpdate(order._id, {
                            paymentStatus: "PAID",
                            orderStatus: "CONFIRMED",
                        })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var handleWebhook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, sig, event, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = req.body;
                sig = req.headers["stripe-signature"];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                event = stripe_1.default.webhooks.constructEvent(payload, sig, endpointSecret);
                if (!(event.type === "checkout.session.completed" ||
                    event.type === "checkout.session.async_payment_succeeded")) return [3 /*break*/, 3];
                return [4 /*yield*/, fulfillCheckout(event.data.object.id)];
            case 2:
                _a.sent();
                res.status(200).send();
                return [2 /*return*/];
            case 3: return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                // @ts-ignore
                res.status(400).send("Webhook Error: ".concat(err_1.message));
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.handleWebhook = handleWebhook;
var createCheckoutSession = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, order, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = req.body.orderId;
                console.log("body", req.body);
                return [4 /*yield*/, Order_1.default.findById(orderId).populate("items.productId")];
            case 1:
                order = _a.sent();
                if (!order) {
                    throw new Error("Order not found");
                }
                return [4 /*yield*/, stripe_1.default.checkout.sessions.create({
                        ui_mode: "embedded",
                        line_items: order.items.map(function (item) { return ({
                            price: item.productId.stripePriceId,
                            quantity: item.quantity,
                        }); }),
                        mode: "payment",
                        return_url: "".concat(FRONTEND_URL, "/shop/complete?session_id={CHECKOUT_SESSION_ID}"),
                        metadata: {
                            orderId: req.body.orderId,
                        },
                    })];
            case 2:
                session = _a.sent();
                res.send({ clientSecret: session.client_secret });
                return [2 /*return*/];
        }
    });
}); };
exports.createCheckoutSession = createCheckoutSession;
var retrieveSessionStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checkoutSession, order;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, stripe_1.default.checkout.sessions.retrieve(req.query.session_id)];
            case 1:
                checkoutSession = _c.sent();
                return [4 /*yield*/, Order_1.default.findById((_a = checkoutSession.metadata) === null || _a === void 0 ? void 0 : _a.orderId)];
            case 2:
                order = _c.sent();
                if (!order) {
                    throw new Error("Order not found");
                }
                res.status(200).json({
                    orderId: order._id,
                    status: checkoutSession.status,
                    customer_email: (_b = checkoutSession.customer_details) === null || _b === void 0 ? void 0 : _b.email,
                    orderStatus: order.orderStatus,
                    paymentStatus: order.paymentStatus,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.retrieveSessionStatus = retrieveSessionStatus;
//# sourceMappingURL=payment.js.map