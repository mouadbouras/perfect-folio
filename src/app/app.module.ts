import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarSection } from './sections/sidebar/sidebar.section';
import { HeaderSection } from './sections/header/header.section';
import { FooterSection } from './sections/footer/footer.section';
import { PortfoliosPage } from './portfolios/portfolios.page';
import { PortfolioComponent } from './portfolios/components/portfolio/portfolio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecuritiesComponent } from './portfolios/components/securities/securities.component';
import { SearchComponent } from './portfolios/components/search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { entityConfig } from './entity-metadata';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PortfolioDataService } from './business-logic/data-services/portfolio-data.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { LoginPage } from './login/login.page';
import { AngularFireModule } from '@angular/fire';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import {
  AngularFireAuthModule,
  USE_EMULATOR as USE_AUTH_EMULATOR,
} from '@angular/fire/auth';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarSection,
    HeaderSection,
    FooterSection,
    PortfoliosPage,
    PortfolioComponent,
    SecuritiesComponent,
    SearchComponent,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [PortfolioDataService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    entityDataService: EntityDataService,
    portfolioDataService: PortfolioDataService
  ) {
    entityDataService.registerService('Portfolio', portfolioDataService); // <-- register it
  }
}
