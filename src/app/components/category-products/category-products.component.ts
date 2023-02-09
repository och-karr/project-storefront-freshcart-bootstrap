import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, Observable, combineLatest, of, shareReplay, startWith, take} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { StoresService } from '../../services/stores.service';
import {FilterFormQueryModel} from "../../query-models/filter-form.query-model";
import {StoreModel} from "../../models/store.model";
import {SortingOptionQueryModel} from "../../query-models/sorting-option.query-model";

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {

  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  readonly currentCategory$: Observable<CategoryModel> = this._activatedRoute.params.pipe(
    switchMap((data) => {
      return this._categoriesService.getOneCategory(+data['categoryId'])
    })
  );
  readonly sortingOptions: Observable<SortingOptionQueryModel[]> = of([
    {
      name: 'Featured',
      symbol: 'featured'
    },
    {
      name: 'Price Low to High',
      symbol: 'price-low-to-high'
    },
    {
      name: 'Price High to Low',
      symbol: 'price-high-to-low'
    },
    {
      name: 'Avg. Rating',
      symbol: 'avg-rating'
    }
  ])

  readonly sortingOption: FormControl = new FormControl();
  readonly sortingOptionValue$: Observable<string | null> = this.sortingOption.valueChanges.pipe(startWith(null), shareReplay(1));

  readonly filterForm: FormGroup = new FormGroup({
    priceFrom: new FormControl(),
    priceTo: new FormControl(),
    rating: new FormControl(),
    store: new FormControl(),
    searchStore: new FormControl()
  });

  readonly filterFormValues$: Observable<FilterFormQueryModel> = this.filterForm.valueChanges.pipe(
    startWith({
      priceFrom: null,
      priceTo: null,
      store: [],
      rating: 0,
      searchStore: '',
    }),
    shareReplay(1)
  )

  readonly storesList$: Observable<StoreModel[]> = combineLatest([
    this._storesService.getAllStores(),
    this.filterFormValues$
  ]).pipe(
    map(([stores, form]) => {
      return stores.filter(store => {
        if (store.name !== null && form.searchStore !== null) {
          return store.name.toLowerCase().includes(form.searchStore.toLowerCase());
        }
        return true;
      })
    })
  );

  private _storesIdsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public storesIds$: Observable<string[]> = this._storesIdsSubject.asObservable().pipe(startWith([]));

  readonly productsList$: Observable<ProductModel[]> = combineLatest([
    this._productsService.getAllProducts(),
    this.currentCategory$,
    this.sortingOptionValue$,
    this.filterFormValues$,
    this.storesIds$
  ]).pipe(
    map(([products, currentCategory, sortingOpt, filterForm, storesIds]) => {
      return products
        .filter(product => product.categoryId === currentCategory.id)
        .sort((prod1, prod2) => this.sortBy(sortingOpt, prod1, prod2))
        .filter(product => this.filterByPrice(product, filterForm))
        .filter(product => this.filterByRating(product.ratingValue, filterForm.rating))
        .filter(product => this.filterByStoreId(storesIds, product))
    }),
    shareReplay(1)
  );

  private _currentLimitSubject: BehaviorSubject<number> = new BehaviorSubject<number>(5);
  public currentLimit$: Observable<number> = this._currentLimitSubject.asObservable().pipe(shareReplay(1));

  private _currentPageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public currentPage$: Observable<number> = combineLatest([
    this.productsList$,
    this._currentPageSubject.asObservable(),
    this.currentLimit$
  ]).pipe(
    map(([products, currentPageSubj, currentLimit]) => Math.ceil(products.length/currentLimit) < currentPageSubj ? 1 : currentPageSubj),
    shareReplay(1)
  )

  readonly limits$: Observable<number[]> = of([5, 10, 15]);
  readonly pages$: Observable<number[]> = combineLatest([
    this.productsList$,
    this.currentLimit$
  ]).pipe(
    map(([products, limit]) => {
      return Array.from({ length: Math.ceil(products.length / limit) }, (_, i) => i + 1)
    })
  )

  readonly paginatedProductsList$: Observable<ProductModel[]> = combineLatest([
    this.productsList$,
    this.currentLimit$,
    this.currentPage$
  ]).pipe(
    map(([products, limit, page]) => products.slice(((page - 1) * limit), ((page - 1) * limit + limit)))
  )

  constructor(private _categoriesService: CategoriesService, private _router: Router, private _activatedRoute: ActivatedRoute, private _productsService: ProductsService, private _storesService: StoresService) {
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

  sortBy(option: (string | null), a: ProductModel, b: ProductModel): number {
    switch (option) {
      case 'price-high-to-low':
        return b.price - a.price;
      case 'price-low-to-high':
        return a.price - b.price;
      case 'featured':
        return b.featureValue - a.featureValue;
      case 'avg-rating':
        return b.ratingValue - a.ratingValue;
      default:
        return 0;
    }
  }

  filterByPrice(prod: ProductModel, form: FilterFormQueryModel): boolean {
    let priceFrom = form.priceFrom === null ? 0 : form.priceFrom;
    let priceTo = form.priceTo === null ? null : form.priceTo;
    return priceTo === null ? prod.price >= priceFrom : prod.price >= priceFrom && prod.price <= priceTo;
  }

  filterByRating(prodRatingValue: number, rating: number): boolean {
    return prodRatingValue >= rating;
  }

  filterByStoreId(ids: string[], prod: ProductModel): boolean {
    return ids.length > 0 ? !!ids.find(id => prod.storeIds.includes(id)) : true;
  }

  doesIncludeId(stores: any, id: string): boolean {
    return stores.includes(id);
  }

  changeLimit(item: number) {
    this._currentLimitSubject.next(item);
  }

  changePage(item: number) {
    this._currentPageSubject.next(item);
  }

  onStoreChange(event: any, id: string): void {
    this._storesIdsSubject.pipe(take(1)).subscribe(storesIds => {
      let chosenStores: Set<string> = new Set<string>(storesIds);
      event.target.checked ? chosenStores.add(id) : chosenStores.delete(id);
      this._storesIdsSubject.next(Array.from(chosenStores));
    })
  }
}
