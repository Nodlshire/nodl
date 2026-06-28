import { normalizeUIError } from '../src/errors/normalize';
import { WnodeDeterminismError, WnodeWorkflowError } from '@wnode/sdk';

describe('UI Error Normalization', () => {
  it('normalizes WnodeDeterminismError', () => {
    const err = new WnodeDeterminismError('UNSAFE_BLOCKTAG', { blockTag: 'latest' });
    const uiError = normalizeUIError(err);
    
    expect(uiError.code).toBe('UNSAFE_BLOCKTAG');
    expect(uiError.message).toBe('A determinism constraint was violated during execution.');
    expect(uiError.context).toEqual({ blockTag: 'latest' });
  });

  it('normalizes WnodeWorkflowError', () => {
    const err = new WnodeWorkflowError('EXECUTION_FAILED', { stepId: 'step_1' });
    const uiError = normalizeUIError(err);
    
    expect(uiError.code).toBe('EXECUTION_FAILED');
    expect(uiError.message).toBe('Workflow execution failed.');
    expect(uiError.context).toEqual({ stepId: 'step_1' });
  });

  it('normalizes standard Errors', () => {
    const err = new Error('Network timeout');
    const uiError = normalizeUIError(err);
    
    expect(uiError.code).toBe('UNKNOWN_RUNTIME_ERROR');
    expect(uiError.message).toBe('Network timeout');
  });

  it('normalizes unknown exceptions', () => {
    const err = 'String exception';
    const uiError = normalizeUIError(err);
    
    expect(uiError.code).toBe('UNKNOWN_ERROR');
    expect(uiError.message).toBe('An unexpected execution error occurred.');
    expect(uiError.context).toEqual({ raw: 'String exception' });
  });
});
