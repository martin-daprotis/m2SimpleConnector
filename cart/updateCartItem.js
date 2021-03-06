"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var nodeCookieHelpers_1 = require("../helpers/nodeCookieHelpers");
var updateCart_1 = require("./common/updateCart");
var constants_1 = require("../constants");
var getError_1 = __importDefault(require("../helpers/getError"));
var get_1 = __importDefault(require("lodash/get"));
/**
 * Magento 2: common -> addToCart
 */
function fetchUC(_a) {
    var cartId = _a.cartId, _b = _a.token, token = _b === void 0 ? null : _b, cartItemId = _a.cartItemId, _c = _a.quantity, quantity = _c === void 0 ? 0 : _c;
    return __awaiter(this, void 0, void 0, function () {
        var rawData, error, data;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, updateCart_1.fetchUpdateCart({
                        cartId: cartId,
                        cartItemId: cartItemId,
                        token: token,
                        quantity: quantity,
                    })];
                case 1:
                    rawData = _d.sent();
                    error = getError_1.default(rawData);
                    if (error) {
                        return [2 /*return*/, {
                                error: error,
                            }];
                    }
                    data = updateCart_1.normalizeUpdateCart(rawData);
                    return [2 /*return*/, __assign({}, data)];
            }
        });
    });
}
/**
 * updateCart handler
 */
function updateCartItem(item, quantity, req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, token, cartItemId, responseData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cartId = nodeCookieHelpers_1.getCookieValue(req, constants_1.COOKIES.M2_GUEST_CART_ID) ||
                        nodeCookieHelpers_1.getCookieValue(req, constants_1.COOKIES.M2_CUSTOMER_CART_ID);
                    token = nodeCookieHelpers_1.getCookieValue(req, constants_1.COOKIES.M2_CUSTOMER_TOKEN);
                    cartItemId = Number(get_1.default(item, 'id'));
                    return [4 /*yield*/, fetchUC({ token: token, cartId: cartId, cartItemId: cartItemId, quantity: quantity })];
                case 1:
                    responseData = _a.sent();
                    if (responseData.error) {
                        throw new Error(responseData.error);
                    }
                    else {
                        return [2 /*return*/, responseData];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = updateCartItem;
