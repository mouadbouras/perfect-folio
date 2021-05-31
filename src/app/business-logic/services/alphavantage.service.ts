import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';
import { AlphaVantageSecurity } from '../models/search-response.model';
import { HttpClient } from '@angular/common/http';
import { AlphaVantageQuote } from '../models/quote-response.model';


@Injectable({
  providedIn: 'root'
})
export class AlphavantageService {
  private searchFunction = environment.alphavantage.searchFunction;
  private quoteFunction = environment.alphavantage.quoteFunction;
  private exchangeFunction = environment.alphavantage.exchangeFunction;
  private url = environment.alphavantage.url;
  private apiKey =  environment.alphavantage.apiKey;

  constructor( private _http: HttpClient ) { }

  public searchSymbol(symbol: string): Observable<AlphaVantageSecurity[]> {
    return this._http.get(`${this.url}${this.searchFunction}&keywords=${symbol}${this.apiKey}`)
    .pipe(
      tap(console.log),
      filter((response: any) => !response['Note']),
      map((response: any) => this.responseToSecurities(response['bestMatches'])),
      tap(console.log)
    );
  }

  public getQuoteForSymbol(symbol: string): Observable<AlphaVantageQuote> {
    return this._http.get(`${this.url}${this.quoteFunction}&symbol=${symbol}${this.apiKey}`)
    .pipe(
      tap(console.log),
      filter((response: any) => !response['Note']),
      map((response: any) => this.responseToQuote(response['Global Quote'])),
      tap(console.log)
    );
  }

  public getCurrencyExchange(fromCurrency: string, toCurrency: string): Observable<number> {
    return this._http.get(`${this.url}${this.exchangeFunction}&from_currency=${fromCurrency}&to_currency=${toCurrency}${this.apiKey}`)
    .pipe(
      tap(console.log),
      filter((response: any) => !response['Note']),
      map((response: any) => response['Realtime Currency Exchange Rate']['5. Exchange Rate'] as number),
      tap(console.log)
    );
  }

  private responseToSecurities(response: any): AlphaVantageSecurity[]  {
    if (response && Array.isArray(response)) {
      const alphaVantageSecurities: AlphaVantageSecurity[] = [];
      for (const security of response) {
        alphaVantageSecurities.push(
          {
            symbol: security['1. symbol'],
            name: security['2. name'],
            type: security['3. type'],
            region: security['4. region'],
            marketOpen: security['5. marketOpen'],
            marketClose: security['6. marketClose'],
            timezone: security['7. timezone'],
            currency: security['8. currency'],
            matchScore: security['9. matchScore'],
          } as AlphaVantageSecurity);
      }

      return alphaVantageSecurities;
    }

    return [];
  }

  private responseToQuote(response: any): AlphaVantageQuote  {
    if (response) {
          return {
            symbol: response['01. symbol'],
            open: response['02. open'],
            high: response['03. high'],
            low: response['04. low'],
            price: response['05. price'],
            volume: response['06. volume'],
            latest_trading_day: response['07. latest trading day'],
            previous_close: response['08. previous close'],
            change: response['09. change'],
            change_percent: response['10. change percent'],
          } as AlphaVantageQuote;
    }

    return {} as AlphaVantageQuote;
  }
}
