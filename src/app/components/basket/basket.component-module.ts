import { NgModule } from '@angular/core';
import { BasketComponent } from './basket.component';
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
  declarations: [BasketComponent],
  providers: [],
  exports: [BasketComponent]
})
export class BasketComponentModule {
}
