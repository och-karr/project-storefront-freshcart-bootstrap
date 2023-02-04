import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {BasketService} from "../../services/basket.service";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasketComponent {

  productsFromBasket: any = this._basketService.getFromStorage();

  constructor(private _basketService: BasketService) {
  }

  test(productsFromBasket: any) {
    console.log(productsFromBasket)
  }
}
