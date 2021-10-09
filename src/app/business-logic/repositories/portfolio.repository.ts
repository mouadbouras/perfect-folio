import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, of } from 'rxjs';
import { Portfolio } from '../models';
import { map, switchMap, tap } from 'rxjs/operators';
import { Currency } from '../models/currency.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioRepository {
  url = environment.firebase.databaseURL;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {}

  get userId(): Observable<string> {
    if (this.afAuth.user) {
      return this.afAuth.user.pipe(map((user) => user.uid));
    }
  }

  add(portfolio: Portfolio) {
    return this.userId.pipe(
      switchMap((userId) =>
        of(this.db.list(`portfolios/${userId}`).push(portfolio).key)
      )
    );
  }

  getAll() {
    return this.userId.pipe(
      switchMap((userId) =>
        this.db
          .list(`portfolios/${userId}`)
          .snapshotChanges()
          .pipe(
            map((data: any) =>
              data.map((res: any) => ({
                key: res.payload.key || null,
                name: res.payload.val().name || null,
                securities: res.payload.val().securities || [],
                investment: res.payload.val().investment || 0,
                cash: res.payload.val().cash || 0,
                currency: Currency[res.payload.val().currency] || null,
                createdDate: res.payload.val().createdDate || 0,
                editedDate: res.payload.val().editedDate || 0,
              }))
            )
          )
      )
    );
  }

  update(portfolio: Portfolio) {
    return this.userId.pipe(
      tap((userId) =>
        this.db.list(`portfolios/${userId}`).update(portfolio.key, {
          investment: portfolio.investment,
          name: portfolio.name,
          securities: portfolio.securities,
          cash: portfolio.cash,
          currency: portfolio.currency,
          createdDate: portfolio.createdDate,
          editedDate: portfolio.editedDate,
        })
      ),
      switchMap(() =>
        of({
          investment: portfolio.investment,
          name: portfolio.name,
          securities: portfolio.securities,
          cash: portfolio.cash,
          currency: portfolio.currency,
          createdDate: portfolio.createdDate,
          editedDate: portfolio.editedDate,
        })
      )
    );
  }

  delete(key: string) {
    return this.userId.pipe(
      tap((userId) => this.db.object(`portfolios/${userId}/` + key).remove())
    );
  }
}
