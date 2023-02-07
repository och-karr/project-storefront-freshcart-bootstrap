import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, shareReplay, tap} from "rxjs";
import { BasketProductQueryModel } from '../query-models/basket-product.query-model';
import {ProductModel} from "../models/product.model";

@Injectable()
export class BasketService {

  private storageItemName = 'basket';

  private _productsSubject: BehaviorSubject<Record<number, BasketProductQueryModel[]>> =
    new BehaviorSubject<Record<number, BasketProductQueryModel[]>>(this.getProductsFromLocalStorage());

  public _products$: Observable<Record<number, BasketProductQueryModel[]>> =
    this._productsSubject.asObservable().pipe(
      tap((products) =>
        this.saveProductsToLocalStorage(products)
      ),
      shareReplay(1)
    );

  getProducts(): Observable<Record<number, BasketProductQueryModel[]>> {
    return this._products$;
  }

  addProductToBasket(item: ProductModel): void {
    let updatedBasketItems: Record<number, any> = this._productsSubject.value;
    const createElement = () => {
      updatedBasketItems[+item.id]  = {
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1
      };
    }

    if (updatedBasketItems) {
      if (+item.id in updatedBasketItems) {
        updatedBasketItems[+item.id]['quantity'] += 1;
      } else {
        createElement();
      }
    } else {
      updatedBasketItems = {}
      createElement();
    }

    this._productsSubject.next(updatedBasketItems);
    this.saveProductsToLocalStorage(updatedBasketItems);
  }

  removeBasketFromStorage() {
    this._productsSubject.next({});
    localStorage.removeItem(this.storageItemName);
  }

  removeProductFromBasket(id: string) {
    let basketItems: Record<number, BasketProductQueryModel[]> = this._productsSubject.value;

    delete basketItems[+id];

    this._productsSubject.next(basketItems);
  }

  private getProductsFromLocalStorage(): Record<number, BasketProductQueryModel[]> {
    const localStorageProducts = window.localStorage.getItem(this.storageItemName);

    if (localStorageProducts != null) return JSON.parse(localStorageProducts);
    return {};
  }

  private saveProductsToLocalStorage(items: Record<number, BasketProductQueryModel[]>): void {
    window.localStorage.setItem(this.storageItemName, JSON.stringify(items));
  }
}
