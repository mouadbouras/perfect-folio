import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
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

  get portfolioKeys(): string[] {
    return this.portfolios ? Object.keys(this.portfolios) : [];
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
    console.log('init');
    this.form = this.fb.group({});
    this.portfolioService.getAll();
    this.portfolios = {};
    this.portfolioService.entities$
      .pipe(
        takeUntil(this.destroy$),
        tap((portfolios) => {
          portfolios.forEach((p) => {
            console.log(p);
            console.log(
              !this.portfolios[p.key] || !isEqual(this.portfolios[p.key], p)
            );
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
    this.portfolioService
      .add({
        name: 'New Portfolio',
        securities: [],
        investment: 0,
        currency: 'USD',
        cash: 0,
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
    this.portfolioService
      .balancePortfolio(this.getPortfolioFromKey(key))
      .pipe(switchMap((portfolio) => this.portfolioService.update(portfolio)))
      .subscribe(() => this.initPortfolios());
  }

  onDelete(key: string): void {
    console.log('edit ' + key);
    this.portfolioService
      .delete(key)
      .pipe(take(1))
      .subscribe(() => this.initPortfolios());
  }

  private getPortfolioFromKey(key: string): Portfolio {
    return this.portfolios[key];
  }
}
