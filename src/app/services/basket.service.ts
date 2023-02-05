import { Injectable } from '@angular/core';

@Injectable()
export class BasketService {

  saveToStorage(item: any, basketItems: any) {

    const createElement = () => {
      basketItems[item.id] = {
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1
      };
    }

    if (basketItems) {
      if (item.id in basketItems) {
        basketItems[item.id]['quantity'] += 1;
      } else {
        createElement();
      }
    } else {
      basketItems = {}
      createElement();
    }

    localStorage.setItem("basket", JSON.stringify(basketItems))
  }

  removeBasketFromStorage() {
    localStorage.removeItem('basket');
  }

  removeItemFromBasket(key: any) {
    let JSONBasketStorage: string | null = localStorage.getItem('basket');
    let JSONBasketParsed: Record<number, any> = JSONBasketStorage !== null ? JSON.parse(JSONBasketStorage) : null;
    delete JSONBasketParsed[key];
    localStorage.removeItem('basket');
    localStorage.setItem("basket", JSON.stringify(JSONBasketParsed));
  }

  getFromStorage() {
    let JSONBasketStorage: string | null = localStorage.getItem('basket');
    let JSONBasketParsed: Record<number, any> = JSONBasketStorage !== null ? JSON.parse(JSONBasketStorage) : null;

    return JSONBasketParsed;
  }
}
