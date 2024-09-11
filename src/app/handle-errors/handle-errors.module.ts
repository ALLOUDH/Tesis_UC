import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponentComponent } from './not-found-component/not-found-component.component';
import { GlobalErrorHandlerComponent } from './global-error-handler/global-error-handler.component';



@NgModule({
  declarations: [
    NotFoundComponentComponent,
    GlobalErrorHandlerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HandleErrorsModule { }
