import { OracleClient, GetVerifiedPriceOptions, VerifiedPrice } from '@wnode/sdk';
import { UIResponse } from '../types';
import { normalizeUIError } from '../errors/normalize';

export class UIOracleAdapter {
  private oracleClient: OracleClient;

  constructor(oracleClient: OracleClient) {
    this.oracleClient = oracleClient;
  }

  public async validatePriceFeed(feedAddress: string, options?: GetVerifiedPriceOptions): Promise<UIResponse<VerifiedPrice>> {
    try {
      const data = await this.oracleClient.getVerifiedPrice(feedAddress, options);
      return { ok: true, data };
    } catch (error: any) {
      return {
        ok: false,
        error: normalizeUIError(error),
      };
    }
  }
}
