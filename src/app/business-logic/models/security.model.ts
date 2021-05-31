import { Currency } from './currency.enum';

export interface Security {
  name?: any;
  symbol?: string;
  price?: number;
  currency?: Currency;
  usPrice?: number;
  percentage?: number;
  count?: number;
}
