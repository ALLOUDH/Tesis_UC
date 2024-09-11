import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthModule } from './auth/auth.module';
import { HandleErrorsModule } from './handle-errors/handle-errors.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    RouterModule,
    ComponentsModule,
    AuthModule,
    HandleErrorsModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
