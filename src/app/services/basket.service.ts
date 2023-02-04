import { Injectable } from '@angular/core';

@Injectable()
export class BasketService {

  saveToStorage(item: any, basketItems: any) {

    if (item.id in basketItems) {
      basketItems[item.id]['quantity'] += 1;
    } else {
      basketItems[item.id] = {
        name: item.name,
        price: item.price,
        quantity: 1
      };
    }

    localStorage.setItem("basket", JSON.stringify(basketItems))
  }

  getFromStorage() {
    let JSONBasketStorage: string | null = localStorage.getItem('basket');
    let JSONBasketParsed: Record<number, any> = JSONBasketStorage !== null ? JSON.parse(JSONBasketStorage) : null;

    return JSONBasketParsed;
  }
}
