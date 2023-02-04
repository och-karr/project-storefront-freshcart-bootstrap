import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, shareReplay } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProductModel } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import {BasketService} from "../../services/basket.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductDetailComponent {

  readonly currentProduct$: Observable<ProductModel> = this._activatedRoute.params.pipe(
    switchMap((data) => {
      return this._productsService.geOneProduct(+data['productId'])
    }),
    shareReplay(1)
  );

  readonly currentCategory$: Observable<any> = combineLatest([
    this.currentProduct$,
    this._categoriesService.getAllCategories()
  ]).pipe(
    map(([product, categories]) => {
      return categories
        .find(category => {
          return category.id === product.categoryId;
        })
    })
  )
  private _basketSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public basket$: Observable<any[]> = this._basketSubject.asObservable();

  constructor(private _basketService: BasketService, private _productsService: ProductsService, private _categoriesService: CategoriesService, private _activatedRoute: ActivatedRoute) {
  }

  productsFromBasket: any = this._basketService.getFromStorage();

  saveProductsToBasket(product: any) {
    this._basketService.saveToStorage(product, this.productsFromBasket);
  }

  countStars(ratingVal: number) {
    let starArray = [];
    for(let i = 0; i < Math.floor(ratingVal); i++) {
      starArray.push(1);
    }

    if(ratingVal > Math.floor(ratingVal)) {
      starArray.push(.5);
    }

    while(starArray.length < 5) {
      starArray.push(0);
    }

    return starArray;
  }
}
