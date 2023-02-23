import { NgModule } from '@angular/core';
import { BasketComponent } from './basket.component';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [BasketComponent],
  providers: [],
  exports: [BasketComponent]
})
export class BasketComponentModule {
}
