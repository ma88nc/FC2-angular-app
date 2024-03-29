import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { DomainService } from './home/welcome/domain.service';
import { TestModule } from './tests/test.module';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgGridModule } from 'ag-grid-angular';
import { LoginModule } from './login/login.module';
import { SecurityModule } from './security/security.module';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),    
    RouterModule.forRoot([
 /*      { path: 'welcome', component: WelcomeComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' } */
      { path: '', component: WelcomeComponent, canActivate: [AuthGuard]},
      { path: 'login', component: LoginComponent},
      { path: '**', redirectTo: ''}
    ]),
    AgGridModule.withComponents(null),
    TestModule, 
    SharedModule,
    AdminModule,
    LoginModule,
    SecurityModule
  ],
  providers: [ DomainService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
