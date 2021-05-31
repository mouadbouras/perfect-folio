import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.section.html',
  styleUrls: [],
})
export class HeaderSection {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  logout() {
    from(this.afAuth.signOut())
      .pipe(
        take(1),
        tap(() => void this.router.navigate(['login']))
      )
      .subscribe();
  }
}
