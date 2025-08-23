"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
var express_1 = require("@clerk/express");
var forbidden_error_1 = __importDefault(require("../../domain/errors/forbidden-error"));
var isAdmin = function (req, res, next) {
    var _a, _b;
    var auth = (0, express_1.getAuth)(req);
    var userIsAdmin = ((_b = (_a = auth.sessionClaims) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.role) === "admin";
    if (!userIsAdmin) {
        throw new forbidden_error_1.default("Forbidden");
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=authorization-middleware.js.map