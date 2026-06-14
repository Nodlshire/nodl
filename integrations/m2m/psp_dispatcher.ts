import { UniversalPaymentObject } from './universal_payment_object';
import { routePayment } from './psp_router';
import * as fs from 'fs';

const FAILOVER_LOG = '/home/obregan/Documents/nodl/integrations/m2m/failover_log.txt';

function logFailover(event: string) {
  fs.appendFileSync(FAILOVER_LOG, `[${new Date().toISOString()}] ${event}\n`);
}

async function callPspAdapter(pspName: string, upo: UniversalPaymentObject) {
  const adapterPath = `../${pspName}/activation_sdk`;
  const pspSdk = await import(adapterPath);
  
  switch(pspName) {
    case 'stripe':
      return await pspSdk.createPaymentIntent(upo.amount_minor_units, upo.currency, upo.idempotency_key);
    case 'coinbase_business':
      return await pspSdk.createCharge(upo.amount_minor_units.toString(), upo.currency);
    case 'bvnk':
      return await pspSdk.createPayment(upo.amount_minor_units, upo.currency);
    case 'checkout':
      return await pspSdk.createPayment(upo.amount_minor_units, upo.currency, upo.idempotency_key);
    case 'adyen':
      return await pspSdk.makePayment(upo.amount_minor_units, upo.currency, upo.idempotency_key);
    case 'okx':
      return await pspSdk.createOrder(upo.amount_minor_units.toString(), upo.currency);
    case 'bridge':
      return await pspSdk.createTransfer(upo.amount_minor_units.toString(), 'destination_mock');
    case 'eco':
      return await pspSdk.processEcoPayment(upo.amount_minor_units.toString());
    default:
      throw new Error(`Unknown PSP adapter: ${pspName}`);
  }
}

export async function dispatchPayment(upo: UniversalPaymentObject, forceFailureTarget?: string) {
  const decision = routePayment(upo);
  let pspList = [decision.psp, ...decision.fallbackCandidates];
  
  const globalFailover = ['stripe', 'checkout', 'adyen', 'coinbase_business', 'bvnk', 'okx'];
  for (const fallback of globalFailover) {
      if (!pspList.includes(fallback)) {
          pspList.push(fallback);
      }
  }

  for (let i = 0; i < pspList.length; i++) {
    const currentPsp = pspList[i];
    try {
      if (currentPsp === forceFailureTarget) {
          throw new Error("Simulated failure for testing");
      }
      const response = await callPspAdapter(currentPsp, upo);
      return {
        success: true,
        psp: currentPsp,
        reason: i === 0 ? decision.reason : 'Failover Success',
        attempts: i + 1,
        response
      };
    } catch (e: any) {
      logFailover(`Failed calling ${currentPsp} for UPO ${upo.payment_id}: ${e.message}`);
    }
  }

  logFailover(`FATAL: All failover PSPs exhausted for UPO ${upo.payment_id}`);
  return { success: false, psp: null, error: 'All PSPs exhausted' };
}
