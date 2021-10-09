import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PortfolioService } from '../business-logic/services/portfolio.service';
import { Portfolio } from '../business-logic/models';
import { BaseComponent } from '../base.component';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.page.html',
  styleUrls: ['./portfolios.page.scss'],
})
export class PortfoliosPage extends BaseComponent implements OnInit {
  public form: FormGroup;
  public portfolios: { [key: string]: Portfolio };
  public toDelete: string;

  get portfolioKeys(): string[] {
    return this.portfolios ? Object.keys(this.portfolios) : [];
  }

  get portfolioValues(): Portfolio[] {
    return this.portfolios
      ? Object.values(this.portfolios).sort(
          (f, s) => s.createdDate - f.createdDate
        )
      : [];
  }

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initPortfolios();
  }

  initPortfolios(): void {
    this.form = this.fb.group({});
    this.portfolioService.getAll();
    this.portfolios = {};
    this.portfolioService.entities$
      .pipe(
        takeUntil(this.destroy$),
        // map((portfolios) => {
        //   return portfolios.sort((f, s) => s.createdDate - f.createdDate);
        // }),
        tap((portfolios) => {
          portfolios.forEach((p) => {
            if (
              !this.portfolios[p.key] ||
              !isEqual(this.portfolios[p.key], p)
            ) {
              this.portfolios[p.key] = p;
            }
          });
        })
      )
      .subscribe();
  }

  portfolioFormInitialized(key: string, form: FormGroup) {
    this.form.setControl(key, form);
  }

  onAddPortfolio(): void {
    const currentTime = Date.now();
    this.portfolioService
      .add({
        name: 'New Portfolio',
        securities: [],
        investment: 0,
        currency: 'USD',
        cash: 0,
        createdDate: currentTime,
        editedDate: currentTime,
      } as Portfolio)
      .pipe(take(1))
      .subscribe();
  }

  onEdit(key: string): void {
    this.portfolioService
      .update(this.form.getRawValue()[key])
      .pipe(take(1))
      .subscribe();
  }

  onBalance(key: string): void {
    const portfolio = this.getPortfolioFromKey(key);
    this.portfolioService
      .updatePortfolioSecurityPrices(portfolio)
      .pipe(
        switchMap((portfolio) =>
          this.portfolioService.balancePortfolio(portfolio)
        ),
        switchMap((portfolio) => this.portfolioService.update(portfolio))
      )
      .subscribe(() => this.initPortfolios());
  }

  onDelete(key: string): void {
    this.toDelete = key;
  }

  onConfirmDelete(): void {
    this.portfolioService
      .delete(this.toDelete)
      .pipe(
        take(1),
        tap(() => (this.toDelete = ''))
      )
      .subscribe(() => this.initPortfolios());
  }

  private getPortfolioFromKey(key: string): Portfolio {
    return this.portfolios[key];
  }
}
