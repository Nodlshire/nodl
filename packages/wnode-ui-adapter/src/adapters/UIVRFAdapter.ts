import { VRFClient, SimulateFulfillmentParams, SimulateFulfillmentResult } from '@wnode/sdk';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class UIVRFAdapter {
  private vrfClient: VRFClient;

  constructor(vrfClient: VRFClient) {
    this.vrfClient = vrfClient;
  }

  public async simulateFulfillment(params: SimulateFulfillmentParams): Promise<UIResponse<SimulateFulfillmentResult>> {
    try {
      const result = await this.vrfClient.simulateFulfillment(params);
      return { ok: true, data: result };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
