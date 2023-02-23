import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {Observable, combineLatest, map} from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';
import { ProductsService } from '../../services/products.service';
import {BasketProductQueryModel} from "../../query-models/basket-product.query-model";
import {PurchaseValuesQueryModel} from "../../query-models/purchase-values.query-model";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasketComponent {

  readonly productsFromBasket$: Observable<BasketProductQueryModel[]> = combineLatest([
    this._productsService.getAllProducts(),
    this._basketService.getProducts()
  ]).pipe(
    map(([allProducts, savedProducts]: [ProductModel[], Record<number, any>]) => {
      return allProducts
        .filter(product => product.id in savedProducts)
        .map(product => ({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: savedProducts[+product.id].quantity
        }))
    }),
  )

  private deliveryFreeFrom: number = 50;
  private defaultServiceFee: number = 3;

  readonly purchaseValues$: Observable<PurchaseValuesQueryModel> = this.productsFromBasket$.pipe(
    map(products => {
      const productsPricesSum = products.reduce((a, c) => a += (c.quantity * c.price), 0);
      const serviceFee = productsPricesSum < this.deliveryFreeFrom ? this.defaultServiceFee : 0;
      return {
        productsPricesSum: productsPricesSum,
        serviceFee: serviceFee,
        subtotal: productsPricesSum + serviceFee
      }
    })
  )

  constructor(private _basketService: BasketService, private _productsService: ProductsService) {
  }

  remove() {
    this._basketService.removeBasketFromStorage();
  }

  removeProduct(prod: any, itemId: string) {
    this._basketService.removeProductFromBasket(itemId);
  }
}
