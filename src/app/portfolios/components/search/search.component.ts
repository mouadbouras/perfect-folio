import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction, SubscriptionLike } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { Security } from 'src/app/business-logic/models';
import { AlphaVantageQuote } from 'src/app/business-logic/models/quote-response.model';
import { AlphaVantageSecurity } from 'src/app/business-logic/models/search-response.model';
import { AlphavantageService } from 'src/app/business-logic/services/alphavantage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [],
})
export class SearchComponent extends BaseComponent implements OnDestroy {
  @Output() securitySelected = new EventEmitter<Security>();

  model: any;
  searching = false;
  searchFailed = false;

  constructor(private _alphavantageService: AlphavantageService) {
    super();
  }

  formatter = (security: Security) => `${security.symbol} - ${security.name}`;

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      takeUntil(this.destroy$),
      debounceTime(600),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this._alphavantageService.searchSymbol(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  public selectSecurity(
    event: NgbTypeaheadSelectItemEvent<AlphaVantageSecurity>
  ): void {
    const security = event.item;
    this._alphavantageService
      .getQuoteForSymbol(security.symbol)
      .pipe(
        takeUntil(this.destroy$),
        map((quote: AlphaVantageQuote) => {
          return {
            name: security.name,
            symbol: security.symbol,
            price: +quote.price,
            currency: security.currency,
            usPrice: 0,
            percentage: 0,
            count: 0,
          } as unknown as Security;
        }),
        tap((security: Security) => {
          this.securitySelected.emit(security);
          this.clear();
        })
      )
      .subscribe();
  }

  public clear() {
    this.model = null;
  }
}
