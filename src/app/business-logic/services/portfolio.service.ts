import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Portfolio, Security } from '../models';
import { AlphavantageService } from './alphavantage.service';
import { cloneDeep } from 'lodash';
import { Currency } from '../models/currency.enum';

@Injectable({ providedIn: 'root' })
export class PortfolioService extends EntityCollectionServiceBase<Portfolio> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private alphavantageService: AlphavantageService
  ) {
    super('Portfolio', serviceElementsFactory);
  }

  private getRates(
    securities: Security[],
    portfolioCurrency: Currency
  ): Observable<{ currency: string; rate: number }[]> {
    const currencies = [portfolioCurrency].concat(
      securities.map((s) => s.currency)
    );

    const rates = [
      of({
        currency: 'USD',
        rate: 1,
      }),
    ];
    const currencyCache = { USD: true };

    for (const currency of currencies) {
      if (currency && !currencyCache[currency]) {
        currencyCache[currency] = true;

        rates.push(
          this.alphavantageService.getCurrencyExchange(currency, 'USD').pipe(
            map((rate: number) => ({
              currency: currency,
              rate: rate,
            }))
          )
        );
      }
    }

    return forkJoin(rates) as Observable<{ currency: string; rate: number }[]>;
  }

  updatePortfolioSecurityPrices(portfolio: Portfolio): Observable<Portfolio> {
    const updatedPortfolio = cloneDeep(portfolio);
    const securityQuotes$ = updatedPortfolio.securities.map((security) =>
      this.alphavantageService.getQuoteForSymbol(security.symbol)
    );

    return forkJoin(securityQuotes$).pipe(
      map((quotes) => {
        updatedPortfolio.securities = updatedPortfolio.securities.map(
          (security) => {
            const quote = quotes.find(
              (quote) => quote.symbol === security.symbol
            );
            security.price = +quote.price;
            security.usPrice = 0;
            return security;
          }
        );

        return updatedPortfolio;
      })
    );
  }

  balancePortfolio(portfolio: Portfolio): Observable<Portfolio> {
    const balancedPortfolio = cloneDeep(portfolio);

    return this.getRates(balancedPortfolio.securities, portfolio.currency).pipe(
      map((rates: { currency: string; rate: number }[]) => {
        balancedPortfolio.securities = this.calculateSecurityCount(
          portfolio,
          rates
        );

        balancedPortfolio.cash = this.calculateLeftoverCash(
          balancedPortfolio,
          rates
        );

        return balancedPortfolio;
      })
    );
  }

  private calculateSecurityCount(
    portfolio: Portfolio,
    rates: { currency: string; rate: number }[]
  ): Security[] {
    const securities = [];
    const portfolioRate =
      0 || rates.find((r) => r.currency === portfolio.currency)?.rate;

    const usInvestment = portfolio.investment * portfolioRate;

    portfolio.securities.forEach((s) => {
      const security = cloneDeep(s);
      const rate = rates.find((r) => r.currency === security.currency).rate;
      security.usPrice = security.price * rate;
      security.count = Math.floor(
        ((((security.percentage as number) / 100) * usInvestment) as number) /
          (security.usPrice as number)
      );

      securities.push(security);
    });

    return securities;
  }

  private calculateLeftoverCash(
    portfolio: Portfolio,
    rates: { currency: string; rate: number }[]
  ): number {
    let cash = 0;
    const portfolioRate =
      0 || rates.find((r) => r.currency === portfolio.currency)?.rate;
    const usInvestment = portfolio.investment * portfolioRate;

    if (portfolio && portfolio.securities) {
      var sum = portfolio.securities
        .map((security) => (security.count * security.usPrice) as number)
        .reduce((a: number, b: number) => a * 1 + b * 1, 0);

      cash = usInvestment - sum;
    }

    return cash / portfolioRate;
  }
}
