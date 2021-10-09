import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DefaultDataService, HttpUrlGenerator, Logger } from '@ngrx/data';

import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Portfolio, Security } from '../models';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { Update } from '@ngrx/entity';

@Injectable()
export class PortfolioDataService extends DefaultDataService<Portfolio> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private portfolioRepository: PortfolioRepository,
    logger: Logger
  ) {
    super('Portfolio', http, httpUrlGenerator);
    logger.log('Created custom Hero EntityDataService');
  }

  getAll(): Observable<Portfolio[]> {
    return this.portfolioRepository.getAll();
  }

  add(entity: Portfolio): Observable<Portfolio> {
    return this.portfolioRepository
      .add(entity)
      .pipe(switchMap((key) => of({ ...entity, key } as Portfolio)));
  }

  update(update: Update<Portfolio>): Observable<Portfolio> {
    const updatedPortfolio = {
      ...update.changes,
      ...{ editedDate: Date.now() },
    } as Portfolio;

    return from(this.portfolioRepository.update(updatedPortfolio)).pipe(
      map(() => updatedPortfolio)
    );
  }

  delete(id: number | string): Observable<number | string> {
    return from(this.portfolioRepository.delete(id.toString())).pipe(
      map(() => id)
    );
  }
}
