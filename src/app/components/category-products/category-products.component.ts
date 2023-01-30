import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Observable, combineLatest, of, startWith} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

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
  readonly sortingOptions: Observable<any[]> = of([
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
  readonly sortingOption$: Observable<string | null> = this.sortingOption.valueChanges.pipe(startWith(null));

  readonly productsList$: Observable<ProductModel[]> = combineLatest([
    this._productsService.getAllProducts(),
    this.currentCategory$,
    this.sortingOption$
  ]).pipe(
    map(([products, currentCategory, sortingOpt]) => {
      return products.filter(product => product.categoryId === currentCategory.id)
        .sort((prod1, prod2) => this.sortBy(sortingOpt, prod1, prod2))
    })
  );

  sortBy(option: (string | null), a: ProductModel, b: ProductModel) {
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

  constructor(private _categoriesService: CategoriesService, private _router: Router, private _activatedRoute: ActivatedRoute, private _productsService: ProductsService) {
  }

}
