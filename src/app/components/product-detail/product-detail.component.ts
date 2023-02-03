import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {combineLatest, Observable, shareReplay} from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {CategoriesService} from "../../services/categories.service";

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

  constructor(private _productsService: ProductsService, private _categoriesService: CategoriesService, private _activatedRoute: ActivatedRoute) {
  }

  test(item: any) {
    console.log(item)
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
