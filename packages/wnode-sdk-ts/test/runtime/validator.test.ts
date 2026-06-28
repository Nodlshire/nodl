import { RuntimeValidator } from '../../src/runtime/validator';
import { WnodeDeterminismError } from '../../src/errors';
import { WnodeClientConfig } from '../../src/types';

describe('RuntimeValidator', () => {
  let configStrict: WnodeClientConfig;
  let validatorStrict: RuntimeValidator;

  beforeEach(() => {
    configStrict = {
      endpoint: 'http://localhost',
      chainId: 1,
      sdkVersion: '1.0.0',
      apiVersion: '1.0',
      strictDeterminism: true,
    };
    validatorStrict = new RuntimeValidator(configStrict);
  });

  describe('validateReadContract', () => {
    it('throws on unsafe blockNumber in strict mode', () => {
      expect(() => {
        validatorStrict.validateReadContract({
          address: '0x123',
          abi: '[]',
          functionName: 'test',
          blockTag: { blockNumber: 123 },
        });
      }).toThrow(WnodeDeterminismError);
    });

    it('passes on finalized blockTag', () => {
      expect(() => {
        validatorStrict.validateReadContract({
          address: '0x123',
          abi: '[]',
          functionName: 'test',
          blockTag: 'finalized',
        });
      }).not.toThrow();
    });
  });

  describe('validateProofOfCompute', () => {
    it('throws on unsupported version', () => {
      expect(() => {
        validatorStrict.validateProofOfCompute({
          version: '2.0',
          workflowId: 'test',
          stepHashes: ['0x123'],
          timestamp: 123,
          chainId: 1,
          blockTag: { finalized: true },
        });
      }).toThrow(WnodeDeterminismError);
    });

    it('passes on valid proof', () => {
      expect(() => {
        validatorStrict.validateProofOfCompute({
          version: '1.0',
          workflowId: 'test',
          stepHashes: ['0x123'],
          timestamp: 123,
          chainId: 1,
          blockTag: { finalized: true },
        });
      }).not.toThrow();
    });
  });
});
