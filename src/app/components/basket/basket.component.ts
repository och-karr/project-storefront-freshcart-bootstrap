import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {BasketService} from "../../services/basket.service";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasketComponent {

  productsFromBasket: Record<any, any> = this._basketService.getFromStorage();
  productsPricesSum = (() => {
    let sum = 0;
    Object.entries(this.productsFromBasket).forEach(([key, value]) => {
      sum += value.price;
    });

    return sum;
  })();

  serviceFee = this.productsPricesSum > 50 ? 0 : 3;
  subtotal = this.productsPricesSum + this.serviceFee;

  constructor(private _basketService: BasketService) {
  }

  test(productsFromBasket: any) {
    console.log(productsFromBasket)
  }

  remove() {
    this._basketService.removeBasketFromStorage();
  }
}
