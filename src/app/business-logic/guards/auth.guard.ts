import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  getUser(): Observable<any> {
    return this.afAuth.authState;
  }

  canActivate(): Observable<boolean> {
    return this.getUser().pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          this.router.navigateByUrl('/login');
          return of(false);
        }
        return of(true);
      }),
      catchError(() => {
        this.router.navigateByUrl('/login');
        return of(false);
      })
    );
  }
}
