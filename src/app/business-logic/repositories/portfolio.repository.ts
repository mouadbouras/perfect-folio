// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { from, of } from 'rxjs';
// import { Portfolio } from '../models';
// import { map } from 'rxjs/operators';
// import { Currency } from '../models/currency.enum';

// @Injectable({
//   providedIn: 'root',
// })
// export class PortfolioRepository {
//   url = environment.firebase.databaseURL;

//   constructor(
//     private db: AngularFireDatabase // private afAuth: AngularFireAuth
//   ) {}

//   get userId() {
//     // if (this.afAuth.auth.currentUser) {
//     //   return this.afAuth.auth.currentUser.uid;
//     // }
//     return '7mPNB2tYtkgUxtbSlK0vvuCOWw12';
//   }

//   addPortfolios(portfolios: Portfolio[]) {
//     portfolios.forEach((portfolio: Portfolio) => {
//       this.db.list(`portfolios/${this.userId}`).push(portfolio);
//     });
//   }

//   getAll() {
//     return this.db
//       .list(`portfolios/${this.userId}`)
//       .snapshotChanges()
//       .pipe(
//         map((data: any) =>
//           data.map((res: any) => ({
//             key: res.payload.key || null,
//             name: res.payload.val().name || null,
//             securities: res.payload.val().securities || [],
//             investment: res.payload.val().investment || 0,
//             cash: res.payload.val().cash || 0,
//             currency: Currency[res.payload.val().currency] || null,
//           }))
//         )
//       );
//   }

//   update(portfolio: Portfolio) {
//     return from(
//       this.db.object(`portfolios/${this.userId}/` + portfolio.key).update({
//         investment: portfolio.investment,
//         name: portfolio.name,
//         securities: portfolio.securities,
//         cash: portfolio.cash,
//         currency: portfolio.currency,
//       })
//     );
//   }

//   delete(key: string) {
//     console.log(key);
//     return this.db.object(`portfolios/${this.userId}/` + key).remove();
//   }
// }

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
    //return '7mPNB2tYtkgUxtbSlK0vvuCOWw12';
  }

  add(portfolio: Portfolio) {
    return this.userId.pipe(
      switchMap((userId) =>
        of(this.db.list(`portfolios/${userId}`).push(portfolio).key)
      )
    );
  }

  //   add(portfolio: Portfolio) {
  //     const portfolios = this.db.list(`portfolios/${this.userId}`);
  //     return portfolios.push(portfolio);
  //   }

  // addPortfolios(portfolios: Portfolio[]) {
  //   this.userId.pipe(
  //     tap((userId) => {
  //       portfolios.forEach((portfolio: Portfolio) => {
  //         this.db.list(`portfolios/${userId}`).push(portfolio);
  //       });
  //     })
  //   );
  // }

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
        })
      ),
      switchMap(() =>
        of({
          investment: portfolio.investment,
          name: portfolio.name,
          securities: portfolio.securities,
          cash: portfolio.cash,
          currency: portfolio.currency,
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
