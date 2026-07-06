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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
var server_1 = require("next/server");
function PATCH(req_1, _a) {
    return __awaiter(this, arguments, void 0, function (req, _b) {
        var wuid, body_1, isMeshCustomer, isNodlr, contextFlags, forbiddenKeys, attempt, ctx, isOwner, isFounder, isCommand, linkMesh, linkNodlr, allowMeshLogin, allowNodlrLogin, payload, res, data, e_1;
        var params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, params];
                case 1:
                    wuid = (_c.sent()).wuid;
                    return [4 /*yield*/, req.json()];
                case 2:
                    body_1 = _c.sent();
                    isMeshCustomer = body_1.isMeshCustomer, isNodlr = body_1.isNodlr, contextFlags = body_1.contextFlags;
                    forbiddenKeys = ["isFounderOrPartner", "isOwner", "isCommand", "isMeshInt", "isNodlrInt", "isTechFounder"];
                    attempt = forbiddenKeys.some(function (k) { return Object.prototype.hasOwnProperty.call(body_1, k); });
                    if (attempt) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Cannot modify system identities" }, { status: 403 })];
                    }
                    ctx = contextFlags || {};
                    isOwner = !!ctx.isOwner;
                    isFounder = !!ctx.isFounderOrPartner;
                    isCommand = !!ctx.isCommand;
                    linkMesh = !!isMeshCustomer;
                    linkNodlr = !!isNodlr;
                    allowMeshLogin = false;
                    allowNodlrLogin = false;
                    if (isOwner || isFounder) {
                        allowMeshLogin = true;
                        allowNodlrLogin = true;
                    }
                    else if (isCommand && !isMeshCustomer && !isNodlr) {
                        allowMeshLogin = false;
                        allowNodlrLogin = false;
                    }
                    else {
                        if (isMeshCustomer)
                            allowMeshLogin = true;
                        if (isNodlr)
                            allowNodlrLogin = true;
                    }
                    payload = {
                        isMeshCustomer: isMeshCustomer,
                        isNodlr: isNodlr,
                        linkMesh: linkMesh,
                        linkNodlr: linkNodlr,
                        allowMeshLogin: allowMeshLogin,
                        allowNodlrLogin: allowNodlrLogin
                    };
                    return [4 /*yield*/, fetch("http://localhost:8080/v1/nodlrs/".concat(wuid), {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                        })];
                case 3:
                    res = _c.sent();
                    if (!res.ok) {
                        console.log("Mocked backend identity propagation:", payload);
                        return [2 /*return*/, server_1.NextResponse.json({ success: true, mocked: true, payload: payload })];
                    }
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _c.sent();
                    return [2 /*return*/, server_1.NextResponse.json(data)];
                case 5:
                    e_1 = _c.sent();
                    console.error(e_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: e_1.message }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
