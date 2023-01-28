import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreProductsComponent } from './store-products.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StoreProductsComponent],
  providers: [],
  exports: [StoreProductsComponent]
})
export class StoreProductsComponentModule {
}
