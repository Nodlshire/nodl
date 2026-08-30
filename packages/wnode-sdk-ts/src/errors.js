"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WnodeDeterminismError = exports.WnodeWorkflowError = exports.WnodeOracleError = exports.WnodeError = void 0;
class WnodeError extends Error {
    code;
    context;
    proof;
    constructor(code, context, proof) {
        super(`${code}: ${JSON.stringify(context)}`);
        this.name = this.constructor.name;
        this.code = code;
        this.context = context;
        this.proof = proof;
    }
}
exports.WnodeError = WnodeError;
class WnodeOracleError extends WnodeError {
    constructor(code, context, proof) {
        super(code, context, proof);
    }
}
exports.WnodeOracleError = WnodeOracleError;
class WnodeWorkflowError extends WnodeError {
    constructor(code, context, proof) {
        super(code, context, proof);
    }
}
exports.WnodeWorkflowError = WnodeWorkflowError;
class WnodeDeterminismError extends WnodeError {
    constructor(code, context, proof) {
        super(code, context, proof);
    }
}
exports.WnodeDeterminismError = WnodeDeterminismError;
