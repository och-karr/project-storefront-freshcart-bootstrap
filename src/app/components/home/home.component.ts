import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {map, Observable, shareReplay, combineLatest} from "rxjs";
import {ProductModel} from "../../models/product.model";
import {ProductsService} from "../../services/products.service";
import {CategoriesService} from "../../services/categories.service";
import {StoreModel} from "../../models/store.model";
import {StoresService} from "../../services/stores.service";
import {StoreTagsService} from "../../services/store-tags.service";
import {StoreTagModel} from "../../models/store-tag.model";
import {StoreWithTagsNamesQueryModel} from "../../query-models/store-with-tags-names.query-model";
import {CategoryModel} from "../../models/category.model";

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent {
  readonly productList$: Observable<ProductModel[]> = this._productsService.getAllProducts().pipe(shareReplay(1));
  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  readonly stores$: Observable<StoreModel[]> = this._storesService.getAllStores();
  readonly storeTags$: Observable<StoreTagModel[]> = this._storeTagsService.getAllStoreTags();

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

  readonly storesList$: Observable<StoreWithTagsNamesQueryModel[]> = combineLatest([
    this.stores$,
    this.storeTags$
  ]).pipe(
    map(([stores, tags]: [StoreModel[], StoreTagModel[]]) =>
      this._mapToStoresWithTagsNames(stores, tags)
    )
  );

  constructor(private _productsService: ProductsService, private _categoriesService: CategoriesService, private _storesService: StoresService, private _storeTagsService: StoreTagsService) {
  }

  private _mapToStoresWithTagsNames(stores: StoreModel[], tags: StoreTagModel[]): StoreWithTagsNamesQueryModel[] {
    const tagsMap = tags.reduce((a, c) => ({...a, [c.id]: c}), {}) as Record<string, StoreTagModel>

    return stores.map((store) => ({
        distanceInMeters: store.distanceInMeters,
        id: store.id,
        logoUrl: store.logoUrl,
        name: store.name,
        tagNames: store.tagIds.map((id) => tagsMap[id].name)
      })
    )
  }

  getProductsByCategoryId(product: ProductModel[], id: string) {
    return product.filter((product) => product.categoryId === id)
      .sort((a, b) => b.featureValue - a.featureValue)
      .slice(0, 5);
  }

}
