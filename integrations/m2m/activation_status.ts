import { M2MClient } from './activation_sdk';
import * as crypto from 'crypto';

export async function checkStatus() {
  const m2m = new M2MClient();
  m2m.registerService('test_service', 'internal://mock');
  
  const token = 'payload.' + crypto.createHmac('sha256', 'secret').update('payload').digest('hex');
  const isValid = m2m.validateToken(token, 'secret');
  
  if (isValid) {
    const res = await m2m.sendRequest('test_service', { ping: true }, token);
    console.log("M2M Status: ONLINE", res);
    return true;
  }
  return false;
}
