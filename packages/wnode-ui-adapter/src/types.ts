import { UIError } from './errors/normalize';

export interface UIResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: UIError;
}
