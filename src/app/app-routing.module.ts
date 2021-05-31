import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './business-logic/guards/auth.guard';
import { LoginPage } from './login/login.page';
import { PortfoliosPage } from './portfolios/portfolios.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolios',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginPage },
  { path: 'portfolios', component: PortfoliosPage, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
