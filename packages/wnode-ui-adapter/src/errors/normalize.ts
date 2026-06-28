import { WnodeDeterminismError, WnodeWorkflowError, WnodeOracleError } from '@wnode/sdk';

export interface UIError {
  code: string;
  message: string;
  context?: any;
}

/**
 * Normalizes all Wnode SDK errors into a safe, deterministic UI error schema.
 * @param error The thrown error from the runtime or SDK.
 * @returns A safe UIError object.
 */
export function normalizeUIError(error: any): UIError {
  if (error instanceof WnodeDeterminismError) {
    return {
      code: error.code || 'DETERMINISM_VIOLATION',
      message: 'A determinism constraint was violated during execution.',
      context: error.context,
    };
  }

  if (error instanceof WnodeWorkflowError) {
    return {
      code: error.code || 'WORKFLOW_FAILED',
      message: 'Workflow execution failed.',
      context: error.context,
    };
  }

  if (error instanceof WnodeOracleError) {
    return {
      code: error.code || 'ORACLE_VALIDATION_FAILED',
      message: 'Oracle invariant validation failed.',
      context: error.context,
    };
  }

  if (error instanceof Error && (error as any).code === 'VRF_SIMULATION_FAILED') {
    return {
      code: 'VRF_SIMULATION_FAILED',
      message: error.message || 'VRF deterministic simulation failed.',
      context: (error as any).context,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_RUNTIME_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected execution error occurred.',
    context: { raw: error },
  };
}
