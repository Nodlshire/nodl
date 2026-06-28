import { ProofOfCompute } from './types';

export class WnodeError extends Error {
  public code: string;
  public context: Record<string, any>;
  public proof?: ProofOfCompute;

  constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute) {
    super(`${code}: ${JSON.stringify(context)}`);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.proof = proof;
  }
}

export class WnodeOracleError extends WnodeError {
  constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute) {
    super(code, context, proof);
  }
}

export class WnodeWorkflowError extends WnodeError {
  constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute) {
    super(code, context, proof);
  }
}

export class WnodeDeterminismError extends WnodeError {
  constructor(code: string, context: Record<string, any>, proof?: ProofOfCompute) {
    super(code, context, proof);
  }
}
