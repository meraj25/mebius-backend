"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var ItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});
var OrderSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    items: {
        type: [ItemSchema],
        required: true,
    },
    addressId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["PENDING", "SHIPPED", "FULFILLED", "CANCELLED"],
        default: "PENDING",
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "CREDIT_CARD"],
        default: "CREDIT_CARD",
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "REFUNDED"],
        default: "PENDING",
    },
});
var Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;
//# sourceMappingURL=Order.js.map