import { Component, OnInit } from '@angular/core';
import {
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
} from 'firebaseui-angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public errorData: FirebaseUISignInFailure;
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.errorData = null;
    this.afAuth.authState
      .pipe(
        take(1),
        tap((user) => {
          if (user) {
            this.router.navigateByUrl('/portfolios');
          }
        })
      )
      .subscribe();
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.router.navigate(['/portfolios']);
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    this.errorData = errorData;
  }

  uiShownCallback() {}
}
