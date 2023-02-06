import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {Observable, combineLatest, map} from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';
import { ProductsService } from '../../services/products.service';
import {BasketProductQueryModel} from "../../query-models/basket-product.query-model";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasketComponent {

  readonly productsFromBasket$: Observable<any[]> = combineLatest([
    this._productsService.getAllProducts(),
    this._basketService.getProducts()
  ]).pipe(
    map(([allProducts, savedProducts]: [ProductModel[], Record<number, any>]) => {
      return allProducts
        .filter(product => product.id in savedProducts)
        .map(product => ({
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: savedProducts[+product.id].quantity
        }))
    })
  )

  constructor(private _basketService: BasketService, private _productsService: ProductsService) {
  }

  remove() {
    this._basketService.removeBasketFromStorage();
  }

  // removeProduct(itemId: string) {
  //   this._basketService.removeProductFromBasket(itemId);
  // }
}
