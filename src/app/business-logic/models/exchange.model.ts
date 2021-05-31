import { Observable } from 'rxjs';

export interface ExchangeRate {
    rate: Observable<number>;
    date: Date;
}