import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {map, Observable} from "rxjs";
import {ProductModel} from "../../models/product.model";
import {ProductsService} from "../../services/products.service";
import {CategoriesService} from "../../services/categories.service";

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly productList$: Observable<ProductModel[]> = this._productsService.getAllProducts();

  readonly fruitsList$: Observable<ProductModel[]> = this.productList$.pipe(
    map((product) => {
      return this.getProductsByCategoryId(product, '5');
    })
  )

  readonly snacksList$: Observable<ProductModel[]> = this.productList$.pipe(
    map((product) => {
      return this.getProductsByCategoryId(product, '2');
    })
  )

  getProductsByCategoryId(product: ProductModel[], id: string) {
    return product.filter((product) => product.categoryId === id)
      .sort((a, b) => b.featureValue - a.featureValue)
      .slice(0, 5);
  }

  constructor(private _productsService: ProductsService, private _categoriesService: CategoriesService) {
  }
}
