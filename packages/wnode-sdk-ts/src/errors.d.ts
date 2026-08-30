import { ProofOfCompute } from './types';
export declare class WnodeError extends Error {
    code: string;
    context: Record<string, any>;
    proof?: ProofOfCompute;
    constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute);
}
export declare class WnodeOracleError extends WnodeError {
    constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute);
}
export declare class WnodeWorkflowError extends WnodeError {
    constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute);
}
export declare class WnodeDeterminismError extends WnodeError {
    constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute);
}
